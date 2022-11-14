Execute in bash
-----------------------
npm un -D @microsoft/sp-tslint-rules
npm i -SE @microsoft/sp-core-library@1.15.2 @microsoft/sp-property-pane@1.15.2 @microsoft/sp-adaptive-card-extension-base@1.15.2 tslib@2.3.1
npm i -DE @microsoft/eslint-plugin-spfx@1.15.2 @microsoft/eslint-config-spfx@1.15.2 @microsoft/sp-build-web@1.15.2 @microsoft/sp-module-interfaces@1.15.2 typescript@4.5.5 ajv@6.12.5 @types/webpack-env@1.15.2 @microsoft/rush-stack-compiler-4.5@0.2.2 @rushstack/eslint-config@2.5.1 eslint@8.7.0
npm dedupe
rm "tslint.json"
cat > ".eslintrc.js" << EOF 
require('@rushstack/eslint-config/patch/modern-module-resolution');
module.exports = {
  extends: ['@microsoft/eslint-config-spfx/lib/profiles/default'],
  parserOptions: { tsconfigRootDir: __dirname }
};
EOF

./.yo-rc.json
-------------
Update version in .yo-rc.json:
{
  "@microsoft/generator-sharepoint": {
    "version": "1.15.2"
  }
}


./tsconfig.json
---------------
Add noImplicitAny in tsconfig.json:
{
  "compilerOptions": {
    "noImplicitAny": true
  }
}

Update tsconfig.json extends property:
{
  "extends": "./node_modules/@microsoft/rush-stack-compiler-4.5/includes/tsconfig-web.json"
}


./config/serve.json
-------------------
Update serve.json schema URL:
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/spfx-serve.schema.json"
}


./.gitignore
------------
To .gitignore add the '.heft' folder:
.heft
