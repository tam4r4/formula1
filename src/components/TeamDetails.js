import React from "react";
import Loader from "./Loader";
import axios from "axios";
import Flag from "react-flagkit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default class TeamDetails extends React.Component {
  state = {
    someRaces: [],
    vozaci: "",
    flags: [],
    country: "",
    loading: true,
    detalji: {},
  };

  componentDidMount() {
    this.getTeamDetails();
  }

  getTeamDetails = async () => {
    console.log(this.props.match.params.name);
    console.log("iza id");

    const id = this.props.match.params.name;
    const url = `http://ergast.com/api/f1/2013/constructors/${id}/results.json`;
    const response = await axios.get(url);

    console.log("response", response.data.MRData.RaceTable.Races);

    const url2 =
      "https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json";

    const response2 = await axios.get(url2);

    console.log("response22", response2.data);

    const url3 = `http://ergast.com/api/f1/2013/constructors/results.json`;

    const response3 = await axios.get(url3);

    const url4 = `http://ergast.com/api/f1/2013/constructors/${id}/constructorStandings.json`;
    const response4 = await axios.get(url4);
    console.log(
      response4.data.MRData.StandingsTable.StandingsLists[0]
        .ConstructorStandings[0]
    );

    this.setState({
      someRaces: response.data.MRData.RaceTable.Races,
      flags: response2.data,
      vozaci: response.data.MRData.RaceTable.Races[0].Results,
      country: response3.data,
      loading: false,
      detalji:
        response4.data.MRData.StandingsTable.StandingsLists[0]
          .ConstructorStandings[0],
    });
  };

  getFlagCode = (nationality) => {
    console.log("getFlagCode");

    //  console.log(country);

    let zastava = this.state.flags.filter(
      (x) => x.en_short_name === nationality
    );
    if (zastava.length) {
      return zastava[0].alpha_2_code;
    } else {
      if (nationality === "UK") {
        return "GB";
      }
      if (nationality === "Korea") {
        return "KR";
      }
      if (nationality === "UAE") {
        return "AE";
      }
    }

    //  return zastava[0].alpha_2_code;
  };

  render() {
    if (this.state.loading) {
      return (
        <div className="kon-loader">
          <Loader />
        </div>
      );
    }

    return (
      <div className="wrapper">
        <dl className="details">
          <p>{this.state.detalji.Constructor.name}</p>
          <p>Country: {this.state.detalji.Constructor.nationality}</p>
          <p>Position: {this.state.detalji.position}</p>
          <p>Points: {this.state.detalji.points}</p>
          <p>
            Biography:
            <a href={this.state.detalji.Constructor.url}>
              <OpenInNewIcon />
            </a>
          </p>
        </dl>

        <table className="tab-container">
          <tr>
            <td>Formula 1 2013 Results</td>
          </tr>
          <div>
            <tr>
              <td>Round</td>
              <td>Grand Prix</td>
              <td> {this.state.vozaci[0].Driver.familyName} </td>
              <td> {this.state.vozaci[1].Driver.familyName} </td>
              <td>Points</td>
            </tr>
          </div>

          {this.state.someRaces.map((x) => (
            <tbody>
              <tr>
                <td>{x.round}</td>
                <td>
                  {" "}
                  <Flag
                    country={this.getFlagCode(x.Circuit.Location.country)}
                  />{" "}
                  {x.raceName}
                </td>
                <td>{x.Results[0].position}</td>
                <td>{x.Results[1].position}</td>
                <td>
                  {parseInt(x.Results[0].points) +
                    parseInt(x.Results[1].points)}
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    );
  }
}
