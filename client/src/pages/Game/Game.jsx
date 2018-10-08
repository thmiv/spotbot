import React from "react";
import '../../assets/style.css';
import UserSeat from '../../components/userSeat';
import Navbar from "../../components/Navbar";
import PopOutRight from '../../components/popOutRight';
import PopOutLeft from '../../components/popOutLeft';
import io from "socket.io-client";
// import ScaleText from 'react-scale-text';


const origin = window.location.origin;

let randNum;
let key;
let interval;

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            author: '',
            message: '',
            messages: [],
            botMsg: 'test123',
            botname: '',
            timer: 15,
            chatActive: false,
            score: null,
            allowVoting: false,
            userNames: [],
            votedFor: ''
        };

        // USE THESE TO TOGGLE FOR PRODUCTION OR IMPLEMENT A SWITCH
        //this.socket = io(origin, {'sync disconnect on unload': true });
        this.socket = io('localhost:3001', { 'sync disconnect on unload': true });
        // END PROD-SWITCH

        // receive chat messages from socket 
        this.socket.on('RECEIVE_MESSAGE', (data) => {
            //console.log("Received msg?", data);
            addMessage(data);
        });

        // receive game messages from socket
        this.socket.on('GAME_MESSAGE', (data) => {
            addMessage(data);
        });

        // from bot <--
        this.socket.on('bot reply', (msg) => {
            //console.log("Received bot msg?", msg);
            this.setState({
                botMsg: msg
            });

            // timeout length calculations
            let timeout = msg.length * 60;
            console.log("milliseconds for timeout: ", timeout);
            //might need to clear timeout
            setTimeout(() => {
                if (this.state.chatActive) {
                    this.socket.emit('SEND_MESSAGE', {
                        author: this.state.botname,
                        message: this.state.botMsg
                    });
                }
            }, timeout);
        });

        // game time logic
        this.socket.on('game_logic', (data) => {
            this.setState(data);
        });

        // This sets username 
        this.socket.on('USER_NAME', (data) => {
            if (this.state.author === '') {
                this.setState(data)
            }
        });

        // This sets bot name 
        this.socket.on('BOT_NAME', (data) => {
            this.setState(data)
        });

        // this will enable chat at game start
        this.socket.on('START_GAME', (data) => {
            this.setState(data);
        });

        // receive endgame from socket
        this.socket.on('END_GAME', (data) => {
            console.log(data)
            console.log("This user is called " + this.state.author)
            console.log("The index of " + this.state.author + " is " + data.userNames.indexOf(this.state.author))
            //This will return the object with the removed username that is used by the current client
            data.userNames.splice((data.userNames.indexOf(this.state.author)), 1);
            // let newData = data.userNames.splice(data.userNames.indexOf(this.state.author), 1);
            // console.log(newData);
            this.setState(data);

            //console.log(this.state.userNames)
            // Run a function that will print out the names of the opposing users in the game in buttons

        });

        // this will end the game 
        this.socket.on('FINAL', (data) => {
            this.results();
        });

        const addMessage = data => {
            //console.log("Data rec'd in addMsg method:", data);
            this.setState({ messages: [...this.state.messages, data] });
            //console.log(this.state.messages);
            this.autoscrollDown()
        };

        // too bot -->
        this.sendToBot = () => {
            // event.preventDefault();
            this.socket.emit('chat message', {
                message: this.state.message
            });
        }

        this.sendMessage = () => {
            // event.preventDefault();
            this.socket.emit('SEND_MESSAGE', {
                author: this.state.author,
                message: this.state.message
            });
            // clear state
            this.setState({ message: '' });
            //console.log("sendMessage Ran. Message state reset to blank: ", this.state.message);
        }
    }

    // final function
    results = () => {
        // This will check if they win
        console.log(this.state.votedFor)
        console.log(this.state.botname)
        if (this.state.votedFor === this.state.botname) {
            console.log("You got it right!!!!!")

        } else {
            console.log("WRONG")
        }
        setTimeout(() => {
            // KICK PEOPLE
        }, 1000);
    }

    vote = value => {
        // event.preventDefault();
        if (this.state.allowVoting) {
            console.log(`I voted for ${value}`);
            this.setState({
                votedFor: value,
                allowVoting: false
            });
        }
    }

    actionsOnClick = event => {
        event.preventDefault();
        //console.log('ACTIONS CALLED.');
        if (this.state.chatActive === true) {
            this.sendMessage();
            this.sendToBot();
        }
    };

    componentDidMount() {
        console.log("Game Canvas (and chat) Component loaded!");
    }

    autoscrollDown = () => {
        const element = document.getElementById("scroll");
        element.scrollTop = element.scrollHeight - element.clientHeight;
    }

    //It's a terrible way to swap it, but here's where chatActive turns on and off.
    handleInputChange = event => {
        if (this.state.chatActive === true) {
            const { name, value } = event.target;
            this.setState({ [name]: value });
        } else {
            console.log("Chat is NOT working because it's flagged to be off in our state");
        }
    }

    genNewKey = () => {
        randNum = Math.floor(Math.random() * 300);
        key = Date.now() + randNum;
        console.log("Key id assigned: ", key);
        // return key;
    }

    timerCountdown = () => {
        interval = setInterval(() => {
            this.setState({
                timer: this.state.timer - 1
            })
            console.log(this.state.timer)

            if (this.state.timer === 0) {
                console.log("this should stop")
                //This will run the stop countdown function below and will stop the timer to continue any furthur
                return this.stopCountdown()
            }

        }, 1000)
    }

    stopCountdown = () => {
        clearInterval(interval)
        //Reset the timer back to the normal state after 3 seconds
        setTimeout(() => {
            this.setState({
                timer: 5
            })
        }, 3000)
    }

    //Creating a logout button
    logout = () => {
        this.props.auth.logout();
        this.props.history.push('/');
    };

    render() {
        return (
            <div className="canvas">
                <Navbar />
                <PopOutLeft />
                <div className="card" id="game-board">

                    <div className="card-title">
                    {/* <ScaleText widthOnly={true} minFontSize={6} maxFontSize={24}> */}
                    Good luck finding Spot, our sneaky chat bot!<br />
                    <span className="subtext">(Chat turns on when the game begins...)</span>
                    {/* </ScaleText> */}
                    <hr />
                    </div>

                   

                    <div className="card-body" id="scroll">
                        <div  className="messages">
                            {this.state.messages.map(message => {
                                return (
                                    <div
                                        // onChange={this.genNewKey()}
                                        key={key}>
                                        {message.author}: {message.message}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="card-footer">
                        <form>
                            <input type="text" placeholder="Message" name="message" className="form-control"
                                onChange={this.handleInputChange}
                                value={this.state.message}
                            />
                            <button onClick={this.actionsOnClick} className="btn btn-dark form-control">Send</button>
                        </form>
                    </div>
                </div>


                <PopOutRight />

                <img className="smallImg fl" id="bot-behind" src="/assets/images/noun_Chatbot_933467.png" />

                <UserSeat time={this.state.timer} vote={this.state.userNames} buttoncheck={this.vote} />
                <div id="logout-button" onClick={this.logout}>
                    <span className="material-icons md-48">settings_backup_restore</span>
                </div>

            </div>
        )
    }
}

export default Game;