#!/bin/sh -ue

sam local invoke MyAuthFunction \
	  -e events/auth-allow.json
