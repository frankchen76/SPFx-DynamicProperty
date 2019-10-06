## sp-fx-dynamic-property

This is a webpart to demonstrate the communication between extension and web part. 

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Run step

* Update server.json to include your test SPO page URL. 
* type ```gulp server``` to compile the code. 
* a extension header will be added into your testing modern page. Add your web part to page. When you change location from header, the web part content will be changed. 
