const express = require("express");
const port = 8080;
const app = express();
const fs = require("fs");
const getRawBody = require("raw-body");
const minutePerDay = 1440;
const localFileName = "local_copy_of_vccl.csv";
app.use(express.json());
app.use(function (req, res, next) {
  if (req.headers["content-type"] === "application/octet-stream") {
    getRawBody(
      req,
      {
        length: req.headers["content-length"],
        encoding: req.charset,
      },
      function (err, string) {
        if (err) return next(err);

        req.body = string;
        next();
      }
    );
  } else {
    next();
  }
});

app.get("/vccl/:id", async (req, res) => {
  const id = req.params.id;
  const responseObj = {};

  /**
   * validation to check id length 
   */
  if (id.length < 8) {
    responseObj.status = "error";
    responseObj.msg = "Provided ID is of invalid length";
  }
  /**
   * get file statistics regarinf local copy of vccl file 
   */
  const statistics = await fs.promises.stat(localFileName);
  /**
   * get uploaded or modify data
   */
  let updaloadedDate = new Date(statistics.mtime);
  /***
   * current date
   */
  let currentDate = new Date();
  /**
   * find difference
   */
  let timeDifference = Math.abs(
    currentDate.getTime() - updaloadedDate.getTime()
  );
  /**
   * convert diff to minute
   */
  let differentMinutes = Math.ceil(timeDifference / 60000);

  /**
   * comparing  is it one day old
   */
  if (differentMinutes >= minutePerDay) {
    responseObj.status = "error";
    responseObj.msg =
      "data is too old to make a determination about the requested ID";
  } else {
    /**
     * read local copy
     */
    var obj = fs.readFileSync(localFileName, "utf8");
    
    responseObj.status = "success";
    responseObj.id = id;
    if (obj.indexOf(id) > -1) {
      responseObj.card_state = "canceled";
    } else {
      responseObj.card_state = "valid";
    }
  }

  /**
   * sedn response
   */
  res.send(responseObj);
});

app.put("/vccl", async (req, res) => {
  try {

    let contentLength = req.headers['content-length']*1;

    if(contentLength > 203000){
      return res.send({ status: "error", msg: "file is too large to hanlde" });
    }
    console.log(":: ",req.headers['content-length']*1)
    let params = req.body
      .toString()
      .split("=")
      .map((v) => v && v != "" && v.replace(/\r\n/g, "").replace(/(")+/g, ""))
      .join();
    /**
     * write file for local refernece
     */
    fs.writeFileSync(localFileName, params);
    /**
     * sedn response
     */
    res.send({ status: "success" });
  } catch (error) {
    res.send({ status: "error", msg: error.message });
  }
});

app.listen(port, () => {
  console.log("app is running", port);
});
