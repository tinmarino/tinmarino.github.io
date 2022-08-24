all:
	#
	# Compile charge
	gcc -fno-stack-protector charge.c -o ./charge
	#
	# Extract charge
	./charge
	#
	# Embed Charge
	cp exploit_template.py exploit.py
	sed -i -e 's/^    b_charge = open.*$$/echo  "    s_b64 = \\"$$(base64 -w 0 charge.bin)\\"\n    b_charge = b64decode(s_b64)\n"/e' exploit.py
	#
	# Add warning
	sed -i -e '0,/^"""/s//"""\n!!! WARNING GENERATED CODE !!!\n(see exploit_template.py)\n/' exploit.py
