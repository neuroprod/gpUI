import React from 'react'

import Head from 'next/head'
import Main from "../src/Main";



export default class Layout extends React.Component {
    private main: Main;
    componentDidMount() {

        let canvas=document.getElementById("webgl") as HTMLCanvasElement;

        this.main =new Main(canvas)



    }

    render() {
      return(  <div>
            <Head>
                <title>title</title>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
            </Head>


            <canvas id="webgl"></canvas>

        </div>)
    }


}
