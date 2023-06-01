import React from 'react'

import Head from 'next/head'
import Main from "../src/TextureTool/Main";


export default class CharmapToBytes extends React.Component {
    private main: Main;

    componentDidMount() {


        this.main = new Main(document.getElementById("myDiv") as HTMLDivElement);

    }

    render() {
        return (<div>
            <Head>
                <title>gpUI example</title>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
            </Head>
            <div id="myDiv">

            </div>

            </div>)
    }


}
