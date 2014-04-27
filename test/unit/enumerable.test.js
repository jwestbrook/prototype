var EnumFixtures = {
  People: [
    {name: 'Sam Stephenson',    nickname: 'sam-'},
    {name: 'Marcel Molina Jr.', nickname: 'noradio'},
    {name: 'Scott Barron',      nickname: 'htonl'},
    {name: 'Nicholas Seckar',   nickname: 'Ulysses'}
  ],
  
  Nicknames: $w('sam- noradio htonl Ulysses'),
  
  Basic: [1, 2, 3],
  
  Primes: [
     1,  2,  3,  5,  7,  11, 13, 17, 19, 23,
    29, 31, 37, 41, 43,  47, 53, 59, 61, 67,
    71, 73, 79, 83, 89,  97
  ],
  
  Z: []
};

for (var i = 1; i <= 100; i++)
  EnumFixtures.Z.push(i);

function prime(value) {
  for (var i = 2; i < value; i++)
    if (value % i == 0) return false;
  return true;
}

suite("Enumerable Namespace",function(){
  test(".each() Break", function() {
    var result = 0;
    EnumFixtures.Basic.each(function(value) {
      if ((result = value) == 2) throw $break;
    });
    
    assert(2 === result);
  });
  
  test(".each() return Acts As Continue",function() {
    var results = [];
    EnumFixtures.Basic.each(function(value) {
    if (value == 2) return;
      results.push(value);
    });

    assert('1, 3' === results.join(', '));
  });
  
  test(".each() passes value, index and collection to the iterator",function() {
    var i = 0;
    EnumFixtures.Basic.each(function(value, index, collection) {
      assert(EnumFixtures.Basic[i] === value);
      assert(i === index);
      assert(EnumFixtures.Basic === collection);
      i++;
    });
  });
  
  test(".each() Chaining",function() {
    assert(EnumFixtures.Primes === EnumFixtures.Primes.each(Prototype.emptyFunction));
    assert(3 === EnumFixtures.Basic.each(Prototype.emptyFunction).length);
  });

  test("EnumContext",function() {
    var results = [];
    EnumFixtures.Basic.each(function(value) {
      results.push(value * this.i);
    }, { i: 2 });
    
    assert('2 4 6' === results.join(' '));

    assert(EnumFixtures.Basic.all(function(value){
      return value >= this.min && value <= this.max;
    }, { min: 1, max: 3 }));
    assert(!EnumFixtures.Basic.all(function(value){
      return value >= this.min && value <= this.max;
    }));
    assert(EnumFixtures.Basic.any(function(value){
      return value == this.target_value;
    }, { target_value: 2 }));
  });

  test(".any() method", function() {
    assert(!([].any()));
    
    assert([true, true, true].any());
    assert([true, false, false].any());
    assert(![false, false, false].any());
    
    assert(EnumFixtures.Basic.any(function(value) {
      return value > 2;
    }));
    assert(!EnumFixtures.Basic.any(function(value) {
      return value > 5;
    }));
  });
  
  test(".any() passes value, index and collection to the iterator", function() {
    var i = 0;
    EnumFixtures.Basic.any(function(value, index, collection) {
      assert(EnumFixtures.Basic[i] === value);
      assert(i === index);
      assert(EnumFixtures.Basic === collection);
      i++;
      
      // Iterate over all values
      return value > 5;
    });
  });
  
  test(".all() method",function() {
    assert([].all());
    
    assert([true, true, true].all());
    assert(![true, false, false].all());
    assert(![false, false, false].all());

    assert(EnumFixtures.Basic.all(function(value) {
      return value > 0;
    }));
    assert(!EnumFixtures.Basic.all(function(value) {
      return value > 1;
    }));
  });
  
  test(".all() passes value, index and collection to the iterator", function() {
    var i = 0;
    EnumFixtures.Basic.all(function(value, index, collection) {
      assert(EnumFixtures.Basic[i] === value);
      assert(i === index);
      assert(EnumFixtures.Basic === collection);
      i++;
      
      // Iterate over all values
      return value > 0;
    });
  });
  
  test(".collect() method",function() {
    assert(EnumFixtures.Nicknames.join(', ') === 
      EnumFixtures.People.collect(function(person) {
        return person.nickname;
      }).join(", "));
    
    assert(26 === EnumFixtures.Primes.map().length);
  });
  
  test(".collect() passes value, index and collection to the iterator", function() {
    var i = 0;
    EnumFixtures.Basic.collect(function(value, index, collection) {
      assert(EnumFixtures.Basic[i] === value);
      assert(i === index);
      assert(EnumFixtures.Basic === collection);
      i++;
      return value;
    });
  });
  
  test(".detect() method",function() {
    assert('Marcel Molina Jr.' ===
      EnumFixtures.People.detect(function(person) {
        return person.nickname.match(/no/);
      }).name);
  });
  
  test(".detect() passes value, index and collection to the iterator", function() {
    var i = 0;
    EnumFixtures.Basic.detect(function(value, index, collection) {
      assert(EnumFixtures.Basic[i] === value);
      assert(i === index);
      assert(EnumFixtures.Basic === collection);
      i++;
      
      // Iterate over all values
      return value > 5;
    });
  });
  
  test(".eachSlice() method",function() {
    assert.deepEqual([], [].eachSlice(2));
    assert(1 === [1].eachSlice(1).length);
    assert.deepEqual([1], [1].eachSlice(1)[0]);
    assert(2 === EnumFixtures.Basic.eachSlice(2).length);
    assert.deepEqual(
      [3, 2, 1, 11, 7, 5, 19, 17, 13, 31, 29, 23, 43, 41, 37, 59, 53, 47, 71, 67, 61, 83, 79, 73, 97, 89],
      EnumFixtures.Primes.eachSlice( 3, function(slice){ return slice.reverse() }).flatten()
    );
    assert.deepEqual(EnumFixtures.Basic, EnumFixtures.Basic.eachSlice(-10));
    assert.deepEqual(EnumFixtures.Basic, EnumFixtures.Basic.eachSlice(0));
    assert(EnumFixtures.Basic !== EnumFixtures.Basic.eachSlice(0));
  });
  
  test(".each() With Index",function() {
    var nicknames = [], indexes = [];
    EnumFixtures.People.each(function(person, index) {
      nicknames.push(person.nickname);
      indexes.push(index);
    });
    
    assert(EnumFixtures.Nicknames.join(', ') === 
      nicknames.join(', '));
    assert('0, 1, 2, 3' === indexes.join(', '));
  });
  
  test(".findAll() method",function() {
    assert(EnumFixtures.Primes.join(', ') === 
      EnumFixtures.Z.findAll(prime).join(', '));
  });
  
  test(".findAll() passes value, index and collection to the iterator",function() {
    var i = 0;
    EnumFixtures.Basic.findAll(function(value, index, collection) {
      assert(EnumFixtures.Basic[i] === value);
      assert(i === index);
      assert(EnumFixtures.Basic === collection);
      i++;
      return value > 5;
    });
  });
  
  test(".grep()",function() {
    assert('noradio, htonl' === EnumFixtures.Nicknames.grep(/o/).join(", "));
      
    assert('NORADIO, HTONL' ===
      EnumFixtures.Nicknames.grep(/o/, function(nickname) {
        return nickname.toUpperCase();
      }).join(", "))

    // assert.deepEqual($('grepHeader', 'grepCell'),
    //   $('grepTable', 'grepTBody', 'grepRow', 'grepHeader', 'grepCell').grep(new Selector('.cell')));

    // troublesome characters
    assert.deepEqual(['?a', 'c?'], ['?a','b','c?'].grep('?'));
    assert.deepEqual(['*a', 'c*'], ['*a','b','c*'].grep('*'));
    assert.deepEqual(['+a', 'c+'], ['+a','b','c+'].grep('+'));
    assert.deepEqual(['{1}a', 'c{1}'], ['{1}a','b','c{1}'].grep('{1}'));
    assert.deepEqual(['(a', 'c('], ['(a','b','c('].grep('('));
    assert.deepEqual(['|a', 'c|'], ['|a','b','c|'].grep('|'));
  });
  
  test(".grep() passes value, index and collection to the iterator", function() {
    var i = 0;
    EnumFixtures.Basic.grep(/\d/, function(value, index, collection) {
      assert.strictEqual(value,EnumFixtures.Basic[i]);
      assert.strictEqual(index, i);
      assert.strictEqual(collection,EnumFixtures.Basic);
      i++;
      return value;
    }, this);
  });
  
  test(".include()", function() {
    assert(EnumFixtures.Nicknames.include('sam-'));
    assert(EnumFixtures.Nicknames.include('noradio'));
    assert(!EnumFixtures.Nicknames.include('gmosx'));
    assert(EnumFixtures.Basic.include(2));
    assert(EnumFixtures.Basic.include('2'));
    assert(!EnumFixtures.Basic.include('4'));
  });
  
  test(".inGroupsOf()", function() {
    assertenum([], [].inGroupsOf(3));
    
    var arr = [1, 2, 3, 4, 5, 6].inGroupsOf(3);
    assert.equal(2, arr.length);
    assertenum([1, 2, 3], arr[0]);
    assertenum([4, 5, 6], arr[1]);
    
    arr = [1, 2, 3, 4, 5, 6].inGroupsOf(4);
    assert.equal(2, arr.length);
    assertenum([1, 2, 3, 4], arr[0]);
    assertenum([5, 6, null, null], arr[1]);
    
    var basic = EnumFixtures.Basic
    
    arr = basic.inGroupsOf(4,'x');
    assert.equal(1, arr.length);
    assertenum([1, 2, 3, 'x'], arr[0]);
    
    assertenum([1,2,3,'a'], basic.inGroupsOf(2, 'a').flatten());

    arr = basic.inGroupsOf(5, '');
    assert.equal(1, arr.length);
    assertenum([1, 2, 3, '', ''], arr[0]);

    assertenum([1,2,3,0], basic.inGroupsOf(2, 0).flatten());
    assertenum([1,2,3,false], basic.inGroupsOf(2, false).flatten());
  });
  
  test(".inject()", function() {
    assert.equal(1061, 
      EnumFixtures.Primes.inject(0, function(sum, value) {
        return sum + value;
      }));
    var sum = EnumFixtures.Primes.inject(0, function(sum, value) {
      if (value === 5) throw $break;
      return sum + value;
    });
    //inject should catch a thrown $break
    assert.equal(6, sum);
  });
  
  test(".inject() passes memo, value, index and collection to the iterator",function() {
    var i = 0;
    EnumFixtures.Basic.inject(0, function(memo, value, index, collection) {
      assert.strictEqual(EnumFixtures.Basic[i], value);
      assert.strictEqual(i, index);
      assert.strictEqual(EnumFixtures.Basic, collection);
      i++;

      return memo + value;
    });
  });
  
  test(".invoke()", function() {
    var result = [[2, 1, 3], [6, 5, 4]].invoke('sort');
    assert.equal(2, result.length);
    assert.equal('1, 2, 3', result[0].join(', '));
    assert.equal('4, 5, 6', result[1].join(', '));
    
    result = result.invoke('invoke', 'toString', 2);
    assert.equal('1, 10, 11', result[0].join(', '));
    assert.equal('100, 101, 110', result[1].join(', '));
  });
  
  test(".max()", function() {
    assert.equal(100, EnumFixtures.Z.max());
    assert.equal(97, EnumFixtures.Primes.max());
    assert.equal(2, [ -9, -8, -7, -6, -4, -3, -2,  0, -1,  2 ].max());
    assert.equal('sam-', EnumFixtures.Nicknames.max()); // ?s > ?U
  });
  
  test(".max() passes value, index and collection to the iterator", function() {
    var i = 0;
    EnumFixtures.Basic.max(function(value, index, collection) {
      assert.strictEqual(EnumFixtures.Basic[i], value);
      assert.strictEqual(i, index);
      assert.strictEqual(EnumFixtures.Basic, collection);
      i++;
      return value;
    });
  });
  
  test(".min()", function() {
    assert.equal(1, EnumFixtures.Z.min());
    assert.equal(0, [  1, 2, 3, 4, 5, 6, 7, 8, 0, 9 ].min());
    assert.equal('Ulysses', EnumFixtures.Nicknames.min()); // ?U < ?h
  });
  
  test(".min() passes value, index and collection to the iterator",function() {
    var i = 0;
    EnumFixtures.Basic.min(function(value, index, collection) {
      assert.strictEqual(EnumFixtures.Basic[i], value);
      assert.strictEqual(i, index);
      assert.strictEqual(EnumFixtures.Basic, collection);
      i++;
      return value;
    });
  });
  
  test(".partition()", function() {
    var result = EnumFixtures.People.partition(function(person) {
      return person.name.length < 15;
    }).invoke('pluck', 'nickname');
    
    assert.equal(2, result.length);
    assert.equal('sam-, htonl', result[0].join(', '));
    assert.equal('noradio, Ulysses', result[1].join(', '));
  });
  
  test(".partition() passes value, index and collection to the iterator", function() {
    var i = 0;
    EnumFixtures.Basic.partition(function(value, index, collection) {
      assert.strictEqual(EnumFixtures.Basic[i], value);
      assert.strictEqual(i, index);
      assert.strictEqual(EnumFixtures.Basic, collection);
      i++;
      return value < 2;
    });
  });
  
  test(".pluck()", function() {
    assert.equal(EnumFixtures.Nicknames.join(', '),
      EnumFixtures.People.pluck('nickname').join(', '));
  });
  
  test(".reject()", function() {
    assert.equal(0, 
      EnumFixtures.Nicknames.reject(Prototype.K).length);
      
    assert.equal('sam-, noradio, htonl',
      EnumFixtures.Nicknames.reject(function(nickname) {
        return nickname != nickname.toLowerCase();
      }).join(', '));
  });
  
  test(".reject() passes value, index and collection to the iterator", function() {
    var i = 0;
    EnumFixtures.Basic.reject(function(value, index, collection) {
      assert.strictEqual(EnumFixtures.Basic[i], value);
      assert.strictEqual(i, index);
      assert.strictEqual(EnumFixtures.Basic, collection);
      i++;
      return value < 2;
    });
  });
  
  test(".sortBy()", function() {
    assert.equal('htonl, noradio, sam-, Ulysses',
      EnumFixtures.People.sortBy(function(value) {
        return value.nickname.toLowerCase();
      }).pluck('nickname').join(', '));
  });
  
  test(".sortBy() passes value, index and collection to the iterator",function() {
    var i = 0;
    EnumFixtures.Basic.sortBy(function(value, index, collection) {
      assert.strictEqual(EnumFixtures.Basic[i], value);
      assert.strictEqual(i, index);
      assert.strictEqual(EnumFixtures.Basic, collection);
      i++;
      return value;
    });
  });
  
  test(".toArray()", function() {
    var result = EnumFixtures.People.toArray();
    assert(result != EnumFixtures.People); // they're different objects...
    assert.equal(EnumFixtures.Nicknames.join(', '),
      result.pluck('nickname').join(', ')); // but the values are the same
  });
  
  test(".zip()", function() {
    var result = [1, 2, 3].zip([4, 5, 6], [7, 8, 9]);
    assert.equal('[[1, 4, 7], [2, 5, 8], [3, 6, 9]]', result.inspect());
    
    result = [1, 2, 3].zip([4, 5, 6], [7, 8, 9], function(array) { return array.reverse() });
    assert.equal('[[7, 4, 1], [8, 5, 2], [9, 6, 3]]', result.inspect());
  });
  
  test(".size()", function() {
    assert.equal(4, EnumFixtures.People.size());
    assert.equal(4, EnumFixtures.Nicknames.size());
    assert.equal(26, EnumFixtures.Primes.size());
    assert.equal(0, [].size());
  });
});