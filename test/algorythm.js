var assert = require('chai').assert;
var EpsilonGreedy = require('../src/lib/epsilon-greedy.js');
var UCB1 = require('../src/lib/ucb1.js');

describe('Epsilon Greedy Algorithm', function() {


  function mode(array){
    if(array.length == 0)
      return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
      var el = array[i];
      if(modeMap[el] == null)
        modeMap[el] = 1;
      else
        modeMap[el]++;  
      if(modeMap[el] > maxCount)
      {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    return maxEl;
  }

  var algo1 = new EpsilonGreedy(0.1, [], []);

  class BernoulliArm {

    constructor(p){
      this.p = p;
    }

    draw(){
      if (Math.random() > this.p) {
        return 0;
      } else {
        return 1;
      }
    }
  }

  var means = [0.1, 0.8, 0.9, 0.1, 0.1];
  var nArms = means.length;
  var arms = [];
  for (var i = 0; i < means.length; i++) {
    arms[i] = new BernoulliArm(means[i]);
  }

  var simulate = function(algo, arms, numSims, horizon){
    var testLength = numSims * horizon;
    var chosenArms = new Array(testLength).fill(0);
    var rewards = new Array(testLength).fill(0);
    var cumulitiveRewards = new Array(testLength).fill(0);
    var simNums = new Array(testLength).fill(0);
    var times = new Array(testLength).fill(0);
    var index = 1;
    algo.initialize(arms.length);
    for  (var sim = 1; sim < testLength + 1; sim++) {
      index = (sim - 1) * horizon + t - 1;
      for (var t = 1; t < horizon + 1; t++) {
        simNums[index] = sim;
        times[index] = t;
        var chosenArm = algo.selectArm();
        chosenArms[index] = chosenArm;
        var reward = arms[chosenArms[index]].draw();
        rewards[index] = reward;

        if (t === 1) {
          cumulitiveRewards[index] = reward;
        } else {
          cumulitiveRewards[index] = cumulitiveRewards[index - 1] + reward;
        }
        
        algo.update(chosenArm, reward);
      }
    }
    
    return [simNums, times, chosenArms, rewards, cumulitiveRewards];

  };


    simulate(algo1, arms, 200, 10);

  describe('Page counters length', function() {

    it('should be equal to amount of arms supplied', function() {
      assert.equal(algo1.counts.length, arms.length);
    });
  });
  describe('Page values length', function() {

    it('should be equal to amount of arms supplied', function() {
      assert.equal(algo1.values.length, arms.length);  
    });
  });
  describe('Number of arms', function() {

    it('should be equal to amount of arms supplied', function() {
      assert.equal(algo1.nArms, arms.length);   
    });
  });
  describe('', function() {

    it('adds the page and returns true', function() {
      assert.equal(algo1.counts.indexOf(Math.max(...algo1.counts)), 2);  
    });
  });
  describe('', function() {

    it('at lease 89% of the time, best arm will be pulled', function() {
      assert.isAtLeast(Math.max(...algo1.values), 0.89);    
    });
  });
});
