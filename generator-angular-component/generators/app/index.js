'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  validateInputText(text) {
    return text !== '';
  };

  //convert an input text with uppercase letters, into all lower case with - between words
  textToFileName(text) {
    if (text) {
      return text
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase();
    }

    return text;
  };

  prompting() {
    const questions = [{
      type: 'input',
      name: 'componentName',
      message: 'Input your component name (without \'Component\' at the end) : ',
      validate: this.validateInputText
    }, {
      type: 'input',
      name: 'modelName',
      message: 'Do you need a model validation ?\nIf yes, input directly the model name (without \'Model\' at the end), \notherwise, type Enter directly.'
    }];

    return this.prompt(questions)
      .then((answers) => {
        this.componentName = answers.componentName;
        this.componentFileName = this.textToFileName(answers.componentName);

        if (answers.modelName !== '') {
          this.hasValidation = true;
          this.modelName = answers.modelName;
          this.modelFileName = this.textToFileName(answers.modelName);
        }
      });
  }

  writing() {
    //index.html
    this.fs.copy(
      this.templatePath('html.txt'),
      this.destinationPath(`./${this.componentFileName}/${this.componentFileName}.html`)
    );

    //controller
    this.fs.copyTpl(
      this.templatePath('controller.txt'),
      this.destinationPath(`./${this.componentFileName}/${this.componentFileName}.controller.js`),
      {
        componentName: this.componentName,
        componentFileName: this.componentFileName
      }
    );

    //component
    this.fs.copyTpl(
      this.templatePath('component.txt'),
      this.destinationPath(`./${this.componentFileName}/${this.componentFileName}.component.js`),
      {
        componentFileName: this.componentFileName
      }
    );

    if (this.hasValidation) {
      this.fs.copyTpl(
        this.templatePath('model.txt'),
        this.destinationPath(`./${this.componentFileName}/${this.modelFileName}.model.js`),
        {
          modelName: this.modelName
        }
      );
      this.fs.copyTpl(
        this.templatePath('validator.txt'),
        this.destinationPath(`./${this.componentFileName}/${this.modelFileName}.validator.js`),
        {
          modelName: this.modelName
        }
      );
    }
  }

  // install() {
  //   this.installDependencies();
  // }
};
