safari_dir := ./dist/instakeybinds.safariextension
chrome_firefox_dir := ./dist/chrome_firefox_extension
src_zip_dir := ./dist/src_zip_dir

all: chrome_firefox_extension safari_extension bookmarklet src_zip

install:
	npm install

clean:
	rm -rf ./dist

bundle:
	npm run webpack

src_zip: bundle
	mkdir -p                     $(src_zip_dir)
	cp    -R                     src/* $(src_zip_dir)
	cp    package.json           $(src_zip_dir)
	cp    Makefile               $(src_zip_dir)
	cp    webpack.config.js      $(src_zip_dir)
	cd    $(src_zip_dir)         &&    \
	zip   src.zip                *     && \
	cd    -
	mv    $(src_zip_dir)/src.zip ./dist/

# Note: chrome and firefox use the same files
chrome_firefox_extension: bundle
	mkdir -p                       $(chrome_firefox_dir)
	cp    ./src/images/16icon.png  $(chrome_firefox_dir)
	cp    ./src/images/48icon.png  $(chrome_firefox_dir)
	cp    ./src/images/128icon.png $(chrome_firefox_dir)
	cp    ./src/manifest.json      $(chrome_firefox_dir)
	cp    ./dist/bundle.js         $(chrome_firefox_dir)
	cd    $(chrome_firefox_dir) && \
	zip   chrome_firefox_extension.zip * && \
	cd    -
	mv    $(chrome_firefox_dir)/chrome_firefox_extension.zip ./dist/


safari_extension: bundle
	mkdir -p               $(safari_dir)
	cp    ./src/Info.plist $(safari_dir)
	cp    ./dist/bundle.js $(safari_dir)
	cp    ./src/images/icon.png   $(safari_dir)


bookmarklet: bundle
	cat ./dist/bundle.js | bookmarkletter > ./dist/bookmarklet.js
