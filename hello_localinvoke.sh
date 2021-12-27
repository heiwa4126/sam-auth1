#!/bin/sh -ue

sam local invoke HelloWorldFunction \
	  -e events/hello.json
