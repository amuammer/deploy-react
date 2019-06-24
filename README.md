# deploy-react

## install
```javascript
npm install -g deploy-react
```

### deploy current folder
```javascript
cd react/app/build_folder

deploy-react .
```

### deploy to specific directory
```javascript
deploy-react -d specificDirectory
```

### deploy to specific entry name
```javascript
deploy-react -e entryName.html
```

### deploy to specific port
```javascript
deploy-react -p 8080
```
### deploy with https
```javascript
deploy-react -https .
```

### ** hint ,, you can write this scripts in package.json of react to get auto deploy
```javascript
"scripts": {
	"postinstall":"npm install -g deploy-react",
    "start": "deploy-react -https -d build"
	}
```

## License

  [MIT](LICENSE)
