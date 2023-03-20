
1.) upload vccl list

curl -v -X PUT -L http://localhost:8080/vccl --header "Content-Type:application/octet-stream" -T {path-to-file}


2.) check id is valid or canceled

culr -X GET http://localhost:8080/vccl/:id




-v : print everything while executing.
-X : which method to use
-L : location where need to upload
--header: pass header in request
-T :  which is short for --upload-file where we pass file path