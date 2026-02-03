License

This work is licensed under a Creative Commons Attribution 4.0 International License


Directory structure

* The private directory contains various libraries, sockets etc. and should be placed in a location where it is not publicly acccessible, but can still be referenced from public php scripts.

* The public directory contains all scripts and resources that are publicly available on the web server.


Installation notes

* The file boot.php in the public directory should be updated so that that the constants PRIVATE_ROOT and PUBLIC_ROOT point to the appropriate locations for the private and public directories respectively.

* The app needs access to a MySQL database that contains tables as specified in database/schema.sql

* In the file private/libs/php/dbLib.php, the database location (usually "localhost"), credentias and name must be updated.
