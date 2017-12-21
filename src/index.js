const natural = require('natural');
const minSentenceLen = 3;
const titleFilter = ['a','about','above','after','again','against','all','am','an','and','any','are',"aren't",'as','at','be','because','been','before','being','below','between','both','but','by',"can't",'cannot','could',"couldn't",'did',"didn't",'do','does',"doesn't",'doing',"don't",'down','during','each','few','for','from','further','had',"hadn't",'has',"hasn't",'have',"haven't",'having','he',"he'd","he'll","he's",'her','here',"here's",'hers','herself','him','himself','his','how',"how's",'i',"i'd","i'll","i'm","i've",'if','in','into','is',"isn't",'it',"it's",'its','itself',"let's",'me','more','most',"mustn't",'my','myself','no','nor','not','of','off','on','once','only','or','other','ought','our','ours','ourselves','out','over','own','same',"shan't",'she',"she'd","she'll","she's",'should',"shouldn't",'so','some','such','than','that',"that's",'the','their','theirs','them','themselves','then','there',"there's",'these','they',"they'd","they'll","they're","they've",'this','those','through','to','too','under','until','up','very','was',"wasn't",'we',"we'd","we'll","we're","we've",'were',"weren't",'what',"what's",'when',"when's",'where',"where's",'which','while','who',"who's",'whom','why',"why's",'with',"won't",'would',"wouldn't",'you',"you'd","you'll","you're","you've",'your','yours','yourself','yourselves','zero'];

function wpFrequency(bagOfWords, totalNumberOfWords){
    let wordsProbability = {};
    for (let key in bagOfWords){
        wordsProbability[key] = bagOfWords[key]/totalNumberOfWords;
    }
    return wordsProbability;
}

function sortWordProb(bagOfWords, wordsProbability){
    let wordArray = [];
    for (let key in bagOfWords){
        wordArray.push([key, wordsProbability[key]]);
    }
    wordArray.sort(function(a,b){
        return b[1]-a[1];
    });
    return wordArray;
}

function swAveraged(sentenceObject, wordsProbability){
    for (let i in sentenceObject){
        let wordLen = sentenceObject[i].contentWords.length;
        if (wordLen<minSentenceLen){
            sentenceObject[i].sentenceWeight = 0;
        } else {
            let sumProb = 0;
            for (let j in sentenceObject[i].contentWords){
                sumProb+= wordsProbability[sentenceObject[i].contentWords[j]];
            }
            sentenceObject[i].sentenceWeight = sumProb/wordLen;
        }
    }
    return sentenceObject;
}

function documentToSentence_bagOfWords(documentList){
    let sentenceList = [], bagOfWords = {}, normalFormWords = {}, totalNumberOfWords = 0;

    for (let k in documentList){
        const originalText = documentList[k];
        const sentences = originalText.match(/[^\.\!\?]*[\.\!\?]/g);//can be replaced with other sentence splitting method.
        for (let i in sentences) {
            const sentence = sentences[i].trim();
            const words = sentence.replace(/[^a-zA-Z0-9 ]/g,"").toLowerCase().split(" ");
            let contentWords = [];
            for (let j in words) {
                const word = natural.PorterStemmer.stem(words[j]);//stemming
                if (titleFilter.indexOf(word)==-1 && word!=""){//not a stopword
                    contentWords.push(word);
                    if (word in bagOfWords){
                        bagOfWords[word]++;
                    } else {
                        bagOfWords[word]=1;
                        normalFormWords[word] = words[j];
                    }
                }
            }
            totalNumberOfWords += contentWords.length;
            if (sentence!="")
                sentenceList.push({sentence:sentence, contentWords:contentWords, sentenceWeight:0, selected:false, documentIndex:k});
        }
    }

    return {totalNumberOfWords,sentenceList,bagOfWords,normalFormWords};
}

function sumBasic(documentList, targetWordCount=10){
    const sentenceProcess = documentToSentence_bagOfWords(documentList);
    let sentenceObject = sentenceProcess.sentenceList;
    const bagOfWords = sentenceProcess.bagOfWords;//distinct
    const normalFormWords = sentenceProcess.normalFormWords;
    const totalNumberOfWords = sentenceProcess.totalNumberOfWords;

    //compute probability of words
    let wordsProbability = wpFrequency(bagOfWords,totalNumberOfWords);//initial wpFrequency()
    //select sentences - special of SumBasic
    let selectedSentences = [];
    let cummulativeWordLen = 0;
    while (cummulativeWordLen<targetWordCount){
        //move bag of words from object to array
        let wordArray = sortWordProb(bagOfWords, wordsProbability);
        //(re)compute sentence weight
        sentenceObject = swAveraged(sentenceObject, wordsProbability);
        //sort the weights
        sentenceObject.sort(function(a,b){
            return b.sentenceWeight-a.sentenceWeight;
        });

        //sumbasic: select best sentence weight that contains the highest prob word
        let found=false;
        let index = 0;
        do {
            if (sentenceObject[index] && (sentenceObject[index].sentence.toLowerCase().indexOf(normalFormWords[wordArray[0][0]])!=-1 || sentenceObject[index].sentence.toLowerCase().indexOf(wordArray[0][0])!=-1) && sentenceObject[index].selected==false){
                found = true;
            } else {
                index++;
                if (index>=sentenceObject.length)
                    break;//fails
            }
        } while (found==false);

        if (found){
            selectedSentences.push(sentenceObject[index].sentence);
            sentenceObject[index].selected=true;
            cummulativeWordLen+=sentenceObject[index].sentence.split(' ').length;

            //modify all prob of used word
            let usedWords = sentenceObject[index].contentWords;
            for (let i in usedWords){
                //let currentUsedWords = natural.PorterStemmer.stem(usedWords[i]);
                wordsProbability[usedWords[i]] = wordsProbability[usedWords[i]]*wordsProbability[usedWords[i]];
            }
        } else {
            if (wordArray[0][1]==0)
                break;
            wordsProbability[wordArray[0][0]]=0;
        }
    }

    return selectedSentences.join(' ');
}

module.exports = sumBasic;