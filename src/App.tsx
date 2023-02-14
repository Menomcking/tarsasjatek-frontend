import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

interface State {
  tarsasjatekok: Tarsasjatek[];
  tarsasjatekNev: string;
  tarsasjatekKiadasiDatum: string;
}
interface Tarsasjatek{
  id: number;
  nev: string;
  kiadasiDatum: Date
}
interface TarsasjatekListResponse{
  tarsasjatekok: Tarsasjatek[];
}

class App extends Component <{}, State>{

  constructor(props: {}){
    super(props);

    this.state = {
      tarsasjatekok: [],
      tarsasjatekNev: "",
      tarsasjatekKiadasiDatum: ""
    }
  }
  async loadTarsasjatekok(){
    let response = await fetch('http://localhost:3001/tarsasjatek');
    let data = await response.json() as Tarsasjatek[];
    this.setState({tarsasjatekok: data})
  }
  componentDidMount(): void {
    this.loadTarsasjatekok();
  }
  handleFill = async () => {
    const {tarsasjatekNev, tarsasjatekKiadasiDatum} = this.state;
    if(tarsasjatekNev.trim() == '' || tarsasjatekKiadasiDatum.trim() == ''){
      return;
    }
    const data = {
      nev: tarsasjatekNev,
      kiadasiDatum: tarsasjatekKiadasiDatum,
    };
    let response = await fetch('http://localhost:3001/tarsasjatek', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    this.setState({
      tarsasjatekNev: '',
      tarsasjatekKiadasiDatum: '',
    })
    await this.loadTarsasjatekok();
  }
  async handleDelete(id:number){
    await fetch('http://localhost:3001/tarsasjatek/'+ id, {
      method: 'DELETE',
    })
    await this.loadTarsasjatekok();
  }
  render() {
    const { tarsasjatekNev, tarsasjatekKiadasiDatum} = this.state;

    return <div id='reg'>
      <div>
      <h1>Új Társasjáték</h1>
      <p>Társasjáték neve: <input type="text" value={tarsasjatekNev} onChange={e => this.setState({tarsasjatekNev: e.currentTarget.value})}></input></p>
      <p>Társasjáték kiadási dátuma: <input type="date" value={tarsasjatekKiadasiDatum} onChange={e => this.setState({tarsasjatekKiadasiDatum: e.currentTarget.value})}></input></p>
      <p><button onClick={this.handleFill}>Adatfelvétel</button></p>
      </div>
      <table>
        <tr><h2>Társasjátékok:</h2></tr>
      {this.state.tarsasjatekok.map(tarsasjatek =>  <tr><td>{tarsasjatek.nev}</td><td><button onClick={() => this.handleDelete(tarsasjatek.id)}>Törlés</button></td></tr>)}
      </table>
    </div>
  }

}

export default App;
