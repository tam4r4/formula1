import React from "react";
import axios from "axios";
import Loader from "./Loader";
import history from "../history";
import Flag from 'react-flagkit';
import YearContext from "../context/YearContext";

export default class AllTeams extends React.Component {
    state = {
        teamStandings: [],
        flags: [],
        loading: true
    }

    componentDidMount() {
        this.getTeams();
    }

    getTeams = async () => {

        let year = this.context.year;

        const url = `http://ergast.com/api/f1/${year}/constructorStandings.json`;
        const url2 = "https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json";

        const response = await axios.get(url);
        const response2 = await axios.get(url2);

        this.setState({
            teamStandings: response.data?.MRData?.StandingsTable?.StandingsLists[0]?.ConstructorStandings,
            flags: response2.data,
            loading: false
        });
    }

    handleTeamDetails = (name) => {

        const linkTo = "/teamDetails/" + name;
        history.push(linkTo);
    }


    getFlagCode = (nationality) => {

        let zastava = this.state.flags.filter(x => x.nationality === nationality);
        if (zastava.length) {
            return zastava[0].alpha_2_code;
        } else {
            if (nationality === "British") {
                return "GB";
            }
        }
    }


    render() {
        if (this.state.loading) {
            return (
                <div className="kon-loader">
                    <Loader />
                </div>
            )
        }

        return (
            <div className="main">
                <h1>CONSTRUCTORS CHAMPIONSHIP</h1>
                <table className="tab-container">
                    <thead>
                        <td colSpan={5}>Constructor Championship Standings - {this.context.year}</td>
                    </thead>
                    <tbody>
                        {this.state?.teamStandings?.map((x) => (
                            <tr key={x?.position}>
                                <td> {x?.position}</td>
                                <td onClick={() => this.handleTeamDetails(x?.Constructor?.constructorId)} className="flag-container cursor">
                                    <Flag country={this.getFlagCode(x?.Constructor?.nationality)} /> {x?.Constructor?.name}
                                </td>
                                <td>
                                    <a href={x?.Constructor?.url}>Details </a>
                                </td>
                                <td>{x?.points}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        );
    }
}

AllTeams.contextType = YearContext;