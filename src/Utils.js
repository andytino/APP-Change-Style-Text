
class Random {
    constructor(max = 1000, allowNegative = true) {
        this.max = max
        this.allowNegative = allowNegative
    }

    randomInt(min,max) {
        if(max > this.max){
            max = this.max
        }
        if(min < 0 && !this.allowNegative){
            min = 0
        }

        min = Math.ceil(min)
        max = Math.ceil(max)
    
        return Math.floor(Math.random() * (max-min + 1)) + min
    }
}



class ColorGen extends Random {
    constructor(max, allowNegative, type = "rgb") {
        super(max, allowNegative)
        if (this.typeList.includes(type)) {
            this.type = type
        } else {
            this.type = 'rgb'
        }
    }

    typeList = ['hex', 'rgb']

    get types() {
        return this.typeList
    }

    set types(types = ['hex', 'rgb']) {
        if(Array.isArray(types)) {
            this.typeList = types.map(type => type)
        }
    }

    color() {
        let r = super.randomInt(0,250)
        let g = super.randomInt(0,250)
        let b = super.randomInt(0,250)
        if(this.type === 'hex') {
            return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
        } else {
            return `rgb(${r},${g},${b})`
        }
    }
}

export const rado = new ColorGen()

const shakespeareApi = "https://api.graph.cool/simple/v1/shakespeare"

let options = () => {
    return {
        method: "POST",
        headers: {
            "Content-type":"application/json"
        },
        body: JSON.stringify({
            query: `{
                allPoems(
                    first: 1
                    skip: ${rado.randomInt(0,160)}
                ) {
                    title
                    author
                    lines
                    text
                }
            }

            `
        })
    }
}

// fetch(shakespeareApi,options()).then(res => res.json()).then(json => {
//     console.log(json)
// })

export async function getRandomPoem() {
    try {
       let result = await fetch(shakespeareApi,options())
       let res = await result.json()
       let poem = res.data.allPoems[0]
       return poem.text
    } catch(error) {
        console.log("Error in get getRandomPoem",error)
        throw error
    }
}