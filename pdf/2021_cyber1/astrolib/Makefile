all:
	# generate html
	cp ../src/html_doc.html ../src/html_doc.gen
	sed -i -e "/placeholder-svg/{r ../src/dot_doc.svg"  -e 'd}' ../src/html_doc.gen

  # Compile lib
	FLAGS=
	gcc \
		-g -O3 \
		-shared \
		astrolib.c mongoose.c \
		-lcrypto \
		-lm \
		-o ../out/astrolib.so \
    -fPIC \
		-Wl,--version-script=libcode.version

  # Compile bin
	gcc astroshell.c -ldl -o ../out/astroshell
	gcc astroserv.c mongoose.c -ldl -D MG_ENABLE_DIRECTORY_LISTING=1 -o ../out/astroserv

  # Move to release and Pedro
	cp -r ../out/astrolib.so ../release/current
	cp -r ../out/astroshell ../release/current
	cp -r ../out/astroserv ../release/current
