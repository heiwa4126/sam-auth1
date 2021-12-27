#!/bin/sh -ue

sam local invoke BasicAuthFunction \
	  -e events/basicauth-allow.json
