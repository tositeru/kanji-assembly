#!/bin/bash

git log -n 1 --stat | \
 /bin/sed -n /\|/p | \
 /bin/sed -n -E "s/^.+([0-9]{4}\/[0-9]{2}\/[0-9]{2})\.Q\.js.+$/echo node Q\/createQ \-e production \1/p" | \
 /bin/bash
