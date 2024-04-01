import { useEffect, useRef, useState } from "react"


enum Operator {
  add = '+',
  subtract = '-',
  multiply = '*',
  divide = '÷',
}

export const useCalculator = () => {

    const [formula, setFormula] = useState('')

    const [number, setNumber] = useState('0')        
    const [prevNumber, setPrevNumber] = useState('0')

    const lastOperation = useRef<Operator>();


  useEffect(() => {

    if( lastOperation.current ){
      const firstFormulaPart = formula.split(' ').at(0)
      setFormula(`${firstFormulaPart} ${lastOperation.current} ${number}`)
    }else{
      setFormula(number)
    }
  }, [number])
  
  useEffect(() => {
    const subResult = calculateSubResult()
    setPrevNumber(`${subResult}`)
  
    
  }, [formula])
  


    const clean = () => {
        setNumber('0')
        setPrevNumber('0')
        lastOperation.current = undefined
        setFormula( ' ')
    }

    const deleteOperation = () => {
      if(number.length <= 1 || number.includes('-') && number.length == 2){
        return setNumber('0')
      }
      const a = number.substring(0, number.length - 1)
      setNumber(a)
    }

    const toggleSign = () => {
      if(number.includes('-')) {
        return setNumber( number.replace('-',''))
      }
      setNumber( '-' + number)
    }

    const buildNumber = (numberString: string ) => {

      if(number.includes('.') && numberString === '.' ) return;

      if( number.startsWith('0') || number.startsWith('-0')){


        if( numberString === '.' ){
          return setNumber(number + numberString)
        }

        if( numberString === '0' && number.includes('.')){
          return setNumber(number + numberString)
        }

        if( numberString !== '0' && !number.includes('.')) {
          return setNumber(numberString)
        }

        if( numberString === '0' && !number.includes('.')){
          return;
        }
        return setNumber( number + numberString )
      }
      setNumber (number + numberString );
    }

    const setLastNumber = () => {

      calculateResult()
      
        if( number.endsWith('.')){
          setPrevNumber (number.slice(0,-1));

        }else{
          setPrevNumber ( number )
        }

        setNumber ('0')
    }


    const divideOperation = () => {
      setLastNumber();
      lastOperation.current = Operator.divide;
    }

    const multiplyOperation = () => {
      setLastNumber();
      lastOperation.current = Operator.multiply;
    }

    const subtrackOperation = () => {
      setLastNumber();
      lastOperation.current = Operator.subtract;
    }

    const addOperation = () => {
      setLastNumber();
      lastOperation.current = Operator.add;
    }



    const calculateResult = () => {

      const resultado = calculateSubResult()
      setFormula(`${resultado}`)
      lastOperation.current = undefined
      setPrevNumber('0')
    }

      const calculateSubResult = ():number => {
        /* const num1 = Number ( number ) 
        const num2 = Number ( prevNumber ) */
        const [firstValue, operation , secondValue ] = formula.split(' ')

        const num1 = Number(firstValue)
        const num2 = Number(secondValue)

        if (isNaN( num2 )  ) return num1
        switch ( operation ) {

          case Operator.add:
            return num1 + num2 
          

          case Operator.subtract:
            return num1 - num2
          

          case Operator.multiply:
            return num1 * num2
         

          case Operator.divide:
            return num1 / num2
            

          default:
            throw new Error ('Operation not implemented')
        }
      }

  return {
    //Properties

    number,
    prevNumber,
    //Methods
    buildNumber,
    formula,
    toggleSign,
    clean,
    deleteOperation,
    divideOperation,
    multiplyOperation,
    subtrackOperation,
    addOperation,
    calculateResult,
  }
}
