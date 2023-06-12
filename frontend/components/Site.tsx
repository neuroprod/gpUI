import React from 'react'

import Head from 'next/head'
import Main from "../src/site/Main";


export default class Site extends React.Component {
    private main: Main;

    componentDidMount() {

        let canvas = document.getElementById("webgpu") as HTMLCanvasElement;
        this.main = new Main(canvas);

    }

    render() {
        return (<div>
            <Head>
                <title>gpUI example</title>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
            </Head>


            <canvas id="webgpu"></canvas>

        </div>)
    }


}
