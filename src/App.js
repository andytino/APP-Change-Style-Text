import React, { Component } from 'react';
import {
  Markup, 
  Container, 
  Column, 
  Row, 
  RuleInput, 
  RuleLabel, 
  StyleInput,
  Button,
  Document,
  Editor,
} from './styled'



import hljs from 'highlight.js'
import {rado, getRandomPoem} from './Utils'

console.log(rado)
console.log(rado.color())

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      editor: "",
      name0: "",
      begin0: "",
      end0: "",
      rule0: "",
      rules: 1
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = e => {
    let {name, value } = e.target
    this.setState({
      [name] : value
    })
  }

  get rules () {
    let { rules } = this.state
    let array = []
    let fields = ['name', 'begin', 'end']
    for (let i = 0; i < rules; i++) {
      array.push(
        <Row
          key = {i}
        >
          <Column>
            {
              fields.map((field, idx) => {
                return (
                  <Column
                    key = {idx}
                  >
                    <RuleLabel>
                      {field}
                    </RuleLabel>
                    <RuleInput
                      value = {this.state[`${field}${i}`]}
                      onChange = {this.handleChange}
                      name = {`${field}${i}`}
                    />
                  </Column>
                )
              })
            }
          </Column>
          <StyleInput
            value = {this.state[`style${i}`]}
            onChange = {this.handleChange}
            name = {`style${i}`}
          />
        </Row>
      )
    }
    return array
  }

  newFields = () => {
    this.setState( (prev) => {
      let { rules } = prev
      let fields = ['name', 'begin', 'end', 'style']
      let inputValues = {}
      fields.forEach((field) => {
        inputValues = {
          ...inputValues,                  //dùng này để lấy các state trước
          [`${field}${rules}`] : ''
        }
      })
      rules++
      console.log({
        rules,
        ...inputValues
      })

      return {
        rules,
        ...inputValues
      }
    })
  }

  convertToMarkup = (text = "") => {
    return {
      __html: hljs.highlightAuto(text).value
    }
  }

  language = (newRules) => {
    return () => ({
      contains: [
        ...newRules
      ]
    })
  }

  resigterLanguage = (state) => {
    let {rules} = state
    let ruleObjects = []
    for(let i = 0; i < rules; i++) {
      let newRule = {
        className: state[`name${i}`],
        begin: state[`begin${i}`],
        end: state[`end${i}`]
      }
      let {className, begin,end} = newRule
      if (
        className.length > 1 &&
        begin.length > 1 &&
        end.length > 1
      ) {
        begin = new RegExp(begin)
        end = new RegExp(end)
        ruleObjects.push(newRule)
      }
    }
    hljs.registerLanguage('language', this.language(ruleObjects))
    hljs.configure({
      languages: ['language']
    })
  }

  componentWillUpdate(nextProps, nextState){
    this.resigterLanguage(nextState)
  }

  prepareStyles = () => {
    let { rules } = this.state
    let styles = []
    for (let i = 0; i< rules; i++) {
      styles.push(`
      .hljs-${this.state['name' + i]} {
        ${this.state['style'+ i]}
      }
      `)
    }
    let newStyles = "".concat(styles).replace(",", "")

    while (newStyles.includes('random')) {
      newStyles = newStyles.replace('random',rado.color())
    }

    return newStyles
  }

  getRandomText = async () => {
    try {
      let poem = await getRandomPoem()
      this.handleChange({                 //this.handleChange is a method that we used to take input from our text fields, and so we want to make sure we put in something like an event object, and the event object has a key of target, and that target is an object that has a key of name
        target: {
          name:'editor',
          value: poem
        }
      })
    } catch(error){
      console.log("getRandomPoem error",error )
    }
  }

  render() {
    let { editor } = this.state
    let { handleChange, newFields, rules,convertToMarkup,prepareStyles,getRandomText } = this 
    return (
      <Container>
        <Column>
        {rules}
          <Button
            onClick = {newFields}
          >
            New rule
          </Button>
        </Column>
        <Column>
          <Button
            onClick = {getRandomText}
          >
            Random Text
          </Button>
          <Document>
            <Editor
              name = "editor"
              value = {editor}
              onChange = {handleChange}
            />
            <Markup
              customStyles= {prepareStyles()}
              dangerouslySetInnerHTML= {convertToMarkup(editor)}
            />
          </Document>
        </Column>
      </Container>
    );
  }
}

export default App;
