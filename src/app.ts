/**
 * Test1
 */
import m = require('./atom');
enum CardSuit {
    Clubs,
    Diamonds,
    Hearts,
    Spades
}

// Sample usage
var card = CardSuit.Clubs;
card = "not a member of card suit";