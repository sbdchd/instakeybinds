safari_dir := ./dist/instakeybinds.safariextension
chrome_firefox_dir := ./dist/chrome_firefox_extension

all: chrome_firefox_extension safari_extension bookmarklet

install:
	npm install

clean:
	rm -rf ./dist

bundle:
	npm run webpack

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
