import './Details.css';

const Details = () => {
    return (
        <div className="details">
            <div>
                <a href="https://github.com/olegkapitonov/Kapitonov-Plugins-Pack">(Kapitonov Plugins Pack)</a> by Oleg Kapitonov
            </div>
            <div>
                Contact me at my <a href="mailto:kotekutalia@gmail.com">email address</a>
            </div>
            <div>
                Official <a href="https://github.com/Kutalia/react-webaudio-5150">GitHub repository</a>
            </div>
            <div>
                Report bugs <a href="https://github.com/Kutalia/react-webaudio-5150/issues">here</a>
            </div>
            <div>
                My story of building the app on <a href="https://kutalia.medium.com/how-i-ported-native-musical-plugins-to-javascript-in-depth-dafa014dae01">Medium</a>
            </div>
        </div>
    );
};

export default Details;
