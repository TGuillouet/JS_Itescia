class Memory {
    constructor() {
        this.tabl = [];
        this.cardsCount = 0;
        this.flippedIndex = 0;
        this.flippedCards = { first: '', second: '' };
        this.score = 0;
        this.time = { min: 0, sec: 0, msec: 0 };
        this.timerVar;
        this.begin = false;

        this.setCards();

        this.setListeners();
    }

    setCards() {
        try {
            let occ = [0, 0, 0, 0];
            let again = true;
            while (again) {
                let r = Math.random();
                if (r <= 0.25) {
                    if (occ[0] < 2) {
                        this.tabl.push(new Card('Guldan', 'https://vignette.wikia.nocookie.net/wow/images/5/54/Gul%27dan_WoD.png/revision/latest?cb=20150508100143&path-prefix=fr', 'https://upload.wikimedia.org/wikipedia/fr/2/22/World_of_Warcraft_logo.png'));
                        occ[0] += 1;
                    }
                } else if (r > 0.25 && r <= 0.5) {
                    if (occ[1] < 2) {
                        this.tabl.push(new Card('Sylvanas', 'https://vignette.wikia.nocookie.net/wow/images/e/e3/SylvanasBfA.png/revision/latest?cb=20171104000621&path-prefix=fr', 'https://upload.wikimedia.org/wikipedia/fr/2/22/World_of_Warcraft_logo.png'));
                        occ[1] += 1;
                    }
                } else if (r > 0.5 && r <= 0.75) {
                    if (occ[2] < 2) {
                        this.tabl.push(new Card('Murloc', 'http://www.blizz-art.com/illustrations/1/pc3pjyc6lae6ee6bw18e52zzssgagx.png', 'https://upload.wikimedia.org/wikipedia/fr/2/22/World_of_Warcraft_logo.png'));
                        occ[2] += 1;
                    }
                } else if (r > 0.75 && r <= 1) {
                    if (occ[3] < 2) {
                        this.tabl.push(new Card('Brewmaster', 'https://vignette.wikia.nocookie.net/wowwiki/images/3/32/Pandaren.jpg/revision/latest?cb=20050415012304', 'https://upload.wikimedia.org/wikipedia/fr/2/22/World_of_Warcraft_logo.png'));
                        occ[3] += 1;
                    }
                }
                let tot = occ[0] + occ[1] + occ[2] + occ[3];
                if (tot === 8) {
                    again = false;
                } 
            }
            this.cardsCount = this.tabl.length;
        } catch (error) {
            console.error(error);
        }
    }

    setListeners() {
        try {
            let cards = document.getElementsByClassName('card');
            this.tabl.map((item, index) => {
                cards[index].addEventListener('click', () => {
                    if (!item.isFind) {
                        item.isFind = true;
                        if (!this.begin) {
                            this.timer();
                            this.begin = true;
                        }
                        if (!item.isFlipped) {
                            let img = cards[index].getElementsByTagName('img').item(0);
                            img.src = item.imgPath;
                            if (typeof this.flippedCards !== 'undefined') {
                                let rank = '';
                                if (typeof this.flippedCards.first !== 'undefined' && this.flippedIndex === 0) {
                                    rank = 'first';
                                    this.flippedIndex++;
                                } else if (typeof this.flippedCards.second !== 'undefined' && this.flippedIndex === 1) {
                                    rank = 'second';
                                    this.flippedIndex++;
                                }
                                this.flippedCards[rank] = { item: item, html: cards[index] };
                                if (this.flippedCards.first !== '' && this.flippedCards.second !== '') {
                                    this.checkValidity();
                                }
                            }
                        }
                    }
                });
            });
        } catch (error) {
            console.error(error)
        }
    }

    checkValidity() {
        try {
            if (this.flippedCards.first.item.cardName === this.flippedCards.second.item.cardName) {
                this.flippedCards.first.html.getElementsByTagName('img')[0].style.filter = 'grayscale(100%)';
                this.flippedCards.second.html.getElementsByTagName('img')[0].style.filter = 'grayscale(100%)';
                this.cardsCount = this.cardsCount - 2;
                this.flippedIndex = 0;
                this.flippedCards = { first: '', second: '' };
                this.updateScore(200);
                if (this.cardsCount == 0) {
                    this.displayMessage('You win !');
                    clearInterval(this.timerVar);
                }
            } else {
                setTimeout(() => {
                    this.flippedCards.first.html.getElementsByTagName('img')[0].src = this.flippedCards.first.item.bg;
                    this.flippedCards.second.html.getElementsByTagName('img')[0].src = this.flippedCards.second.item.bg;
                    this.flippedCards.first.item.isFind = false;
                    this.flippedCards.second.item.isFind = false;
                    this.updateScore(-50);
                    this.flippedIndex = 0;
                    this.flippedCards = { first: '', second: '' };
                }, 500);
            }
        } catch (error) {
            console.error(error);
        }
    }

    updateScore(score) {
        this.score += score;
        document.getElementById('score').innerText = this.score;
    }

    timer() {
        try {
            this.timerVar = setInterval(() => {
                this.time.msec += 10;
                if (this.time.msec === 100) {
                    this.time.msec = 0;
                    this.time.sec += 1;
                    if (this.time.sec === 60) {
                        this.time.min += 1;
                    }
                }
                document.getElementById('time').innerText = (this.time.min < 60 ? '0' + this.time.min : this.time.min) + ':' + (this.time.sec < 10 ? '0' + this.time.sec : this.time.sec) + ':' + (this.time.msec < 10 ? '0' + this.time.msec : this.time.msec);
            }, 100);
        } catch (error) {
            console.error(error);
        }
    }

    displayMessage(message) {
        document.getElementById('winMessage').innerText = message.toUpperCase();
    }

    launch() { 
        return this.tabl;
    }
}

class Card {
    constructor(name, imgPath, bg) {
        this.imgPath = imgPath;
        this.cardName = name;
        this.bg = bg;
        this.isFlipped = false;
        this.isFind = false;
        this.renderCard();
    }

    renderCard() {
        const container = document.getElementsByClassName('container').item(0);
        let card = document.createElement('div');
        card.className = 'card';
        let img = card.appendChild(document.createElement('img'));
        container.appendChild(card);
        img.style.width = '100%';
        img.src = this.bg;
    }
}

let game = new Memory();
game.launch();