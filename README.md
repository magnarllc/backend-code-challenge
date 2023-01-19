# Magnar Backend Development Challenge

## Preamble 

* Thank you for interviewing with Magnar. The goal of this code challenge is to
  assess basic competency in backend engineering fundamentals and developmental
  best practices.

* We understand that this challenge is part of a job interview being done on the
  candidate's own time and we aim to be respectful of that. Plan to spend about
  1-2hrs on the task. If you find that the challenge is taking much beyond this amount
  of time, please stop writing code and refocus on communicating your intent
  through comments or other documentation. It is more important that we
  understand what you are trying to accomplish and how you would get there than
  for you to deliver a flawlessly working technical artifact.

* If you have any questions concerning the challenge description or requirements,
  please don't hesitate to send an email to Bob Sherbert <bob@magnar.recruitee.com>.

## Description of Task

One of the data sources that Magnar makes use of in identity verification is a
TSA managed credential revocation list know as the "Canceled Card List" (CCL).
As part of a card validity check, the identifiers printed on the card will be
compared against the CCL to determine if the card has been administratively
revoked. When a card's ID number appears on the list, it is an indication that
the card has been revoked, and is no longer valid.  For this challenge you will
write a simple application to assist in performing this check.


Write a sever application that can be used to check if a particular card's ID
number is present on the CCL. The program should meet the following requirements:

* Run on Node.js 18.x (current LTS) and be written using express.js 

* Serve the application directly on port 8080. Plain HTTP is fine (no HTTPS is
  needed), and no load balancer or proxy is necessary (e.g. nginx).

* Implement two endpoints (described below) which assist in checking whether
  a given ID number is present on the VCCL. One of the endpoints will provide a
  mechanism to feed an updated copy of the full VCCL into the service. The second will
  allow the user to request the status of a particular ID number.

* You can obtain a copy of the official Visual Canceled Card List (VCCL) from:
      https://tsaenrollmentbyidemia.tsa.dhs.gov/ccl/VCCL.CSV
  We will use this official list when evaluating the solution.

* The VCCL data tracked by the app should never be more than one day old. If
  the local copy of the CCL exceeds one day in age, the service should return an
  error status indicating that the data is too old to make a determination about
  the requested ID.

* Include instructions for how to run your application. A CLI driven build
  procedure is preferred and your application should not be dependant on any
  IDE.

* Other than those explicitly specified here, the application may be written
  using whatever tools/libraries you feel most comfortable working in.

* Please submit your application in source formats. You may submit your solution
  by email in a zip/tar archive or though a git repository. We request that your
  do not make your solution publicly viewable on the internet.

* If you wish to make use of a database, we'd suggest using an in-memory SQLite
  database. We do not expect or require data to outlast the lifetime of the
  application process.

## Endpoint Specifications

### http://{server}/vccl

PUT - used to provide a copy of the VCCL to the service

Example:

  curl http://{server}/vccl --upload-file {path-to-vccl.csv}

Success Response (200):
 
  { 
    "status": "success"
  }

Error Response (200):

  { 
    "status": "error",
    "msg": "<descriptive error message>"
  }


### http://{server}/vccl/:id

GET - Query whether the provided ID number is on the CCL, and by extension, whether
or not it has been canceled.

If the value provided is present on the VCCL, the service should report to the
user that the value is a "canceled" ID. If the value is _not_ present in the
list, then the value is reported as a "valid" ID. Please note that all valid IDs
are *exactly* eight (8) digits in length.

Example:
   
  curl http://{server}/vccl/11111111

Success Response (200):

  {
    "status": "success",
    "id": 11111111,
    "card_state": "valid"
  }

Example:
  
  curl http://{server}/vccl/19746822

Success Response (200):

  {
    "status": "success",
    "id": 19746822,
    "card_state": "canceled"
  }

Example:

  curl http://{server}/vccl/1234

Error Response (200):

  {
    "status": "error",
    "msg": "Provided ID is of invalid length"
  }


## Evaluation Criteria:

Through this evaluation we are trying to understand what you think of as
"production grade" code.  Some examples of things we'll be looking for are
listed below, but as you're completing the challenge you should be thinking
about what that phrase means to you. 

* Basic functionality of the program - Does it do what the specification
  describes?

* Documentation and Communication - What are you doing and why are you doing
  it?

* Defensive coding - Are you anticipating ways things can break and
  proactively addressing them?

* Security - The specification allows for unrestricted PUT of files to
  this service. What sorts of basic precautions should you be taking to prevent
  the service from being exploited?

* If you can include a few test cases, we'll be thrilled.

* It is not necessary to execute on every good idea. If there is some
  feature/check/test/etc. that you would have liked to include if time was
  not a factor, clearly communicating _what you would have done_ is almost as
  good as having actually done it.

Good Luck!
