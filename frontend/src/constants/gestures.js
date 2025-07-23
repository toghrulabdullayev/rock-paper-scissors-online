import RockImg from "/src/assets/images/icon-rock.svg";
import PaperImg from "/src/assets/images/icon-paper.svg";
import ScissorsImg from "/src/assets/images/icon-scissors.svg";
import LizardImg from "/src/assets/images/icon-lizard.svg";
import SpockImg from "/src/assets/images/icon-spock.svg";

export const GESTURES = [
  { move: "spock", img: SpockImg, styles: "bg-spock border-spock" },
  { move: "scissors", img: ScissorsImg, styles: "bg-scissors border-scissors" },
  { move: "paper", img: PaperImg, styles: "bg-paper border-paper" },
  { move: "lizard", img: LizardImg, styles: "bg-lizard border-lizard" },
  { move: "rock", img: RockImg, styles: "bg-rock border-rock" },
];

// When the order of moves in the GESTURES array changes, they will keep their positioning-related styles
export const POSITIONS = [
  { position: "self-end" },
  { position: "max-custom:self-center max-custom:-mt-5" },
  { position: "self-end" },
];

export const WINS = {
  spock: ["scissors", "rock"],
  scissors: ["paper", "lizard"],
  paper: ["rock", "spock"],
  lizard: ["spock", "paper"],
  rock: ["lizard", "scissors"],
};

export const LOSES = {
  scissors: ["spock", "rock"],
  paper: ["lizard", "scissors"],
  rock: ["paper", "spock"],
  lizard: ["rock", "scissors"],
  spock: ["paper", "lizard"],
};
