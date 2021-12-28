#!/bin/sh -ue

sam local invoke MyRequestAuthFunction \
	-e events/reqauth-allow.json
