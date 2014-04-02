var $RunBenchmarks = false;

function reduce(arr) {
  return arr.length > 1 ? arr : arr[0];
}

var IE8 = Prototype.Browser.IE && navigator.userAgent.indexOf('MSIE 8');

suite("Selector Interactions",function(){
  this.timeout(0);
  test("Selector With Tag Name", function() {
    assertenum($A(document.getElementsByTagName('li')), $$('li'));
    assertenum([$('strong')], $$('strong'));
    assertenum([], $$('nonexistent'));
    
    var allNodes = $A(document.getElementsByTagName('*')).select( function(node) {
      return node.tagName !== '!';
    });      
    assertenum(allNodes, $$('*'));
  });
  
  test("Selector With Id", function() {
    assertenum([$('fixtures')], $$('#fixtures'));
    assertenum([], $$('#nonexistent'));
    assertenum([$('troubleForm')], $$('#troubleForm'));
  });
  
  test("Selector With Class Name", function() {
    assertenum($('p', 'link_1', 'item_1'), $$('.first'));
    assertenum([], $$('.second'));
  });
  
  test("Selector With Tag Name And Id", function() {
    assertenum([$('strong')], $$('strong#strong'));
    assertenum([], $$('p#strong'));
  });
  
  test("Selector With Tag Name And Class Name", function() {
    assertenum($('link_1', 'link_2'), $$('a.internal'));
    assertenum([$('link_2')], $$('a.internal.highlight'));
    assertenum([$('link_2')], $$('a.highlight.internal'));
    assertenum([], $$('a.highlight.internal.nonexistent'));
  });
  
  test("Selector With Id And Class Name", function() {
    assertenum([$('link_2')], $$('#link_2.internal'));
    assertenum([$('link_2')], $$('.internal#link_2'));
    assertenum([$('link_2')], $$('#link_2.internal.highlight'));
    assertenum([], $$('#link_2.internal.nonexistent'));
  });
  
  test("Selector With Tag Name And Id And ClassName", function() {
    assertenum([$('link_2')], $$('a#link_2.internal'));
    assertenum([$('link_2')], $$('a.internal#link_2'));
    assertenum([$('item_1')], $$('li#item_1.first'));
    assertenum([], $$('li#item_1.nonexistent'));
    assertenum([], $$('li#item_1.first.nonexistent'));
  });
  
  test("$$() Matches Ancestry With Tokens Separated By Whitespace", function() {
    assertenum($('em2', 'em', 'span'), $$('#fixtures a *'));
    assertenum([$('p')], $$('div#fixtures p'));
  });
  
  test("$$() Combines Results When Multiple Expressions Are Passed", function() {
    assertenum($('link_1', 'link_2', 'item_1', 'item_2', 'item_3'), $$('#p a', ' ul#list li '));
  });

  test("Selector With Tag Name And Attribute Existence", function() {
    assertenum($$('#fixtures h1'), $$('h1[class]'), 'h1[class]');
    assertenum($$('#fixtures h1'), $$('h1[CLASS]'), 'h1[CLASS]');
    assertenum([$('item_3')], $$('li#item_3[class]'), 'li#item_3[class]');
  });
  
  test("Selector With Tag Name And Specific Attribute Value", function() {
    assertenum($('link_1', 'link_2', 'link_3'), $$('#fixtures a[href="#"]'));
    assertenum($('link_1', 'link_2', 'link_3'), $$('#fixtures a[href=#]'));
  });
  
  test("Selector With Tag Name And Whitespace Tokenized Attribute Value", function() {
    assertenum($('link_1', 'link_2'), $$('a[class~="internal"]'), "a[class~=\"internal\"]");
    assertenum($('link_1', 'link_2'), $$('a[class~=internal]'), "a[class~=internal]");
  });
  
  test("Selector With Attribute And No Tag Name", function() {
    assertenum($(document.body).select('a[href]'), $(document.body).select('[href]'));
    assertenum($$('a[class~="internal"]'), $$('[class~=internal]'));
    assertenum($$('*[id]'), $$('[id]'));
    assertenum($('checked_radio', 'unchecked_radio'), $$('[type=radio]'));
    assertenum($$('*[type=checkbox]'), $$('[type=checkbox]'));
    assertenum($('with_title', 'commaParent'), $$('[title]'));
    assertenum($$('#troubleForm *[type=radio]'), $$('#troubleForm [type=radio]'));
    assertenum($$('#troubleForm *[type]'), $$('#troubleForm [type]'));
  });
  
  test("Selector With Attribute Containing Dash", function() {
    assertenum([$('attr_with_dash')], $$('[foo-bar]'), "attribute with hyphen");
  });
  
  test("Selector With Tag Name And Negated Attribute Value", function() {
    assertenum([], $$('#fixtures a[href!="#"]'));
  });

  test("Selector With Bracket Attribute Value", function() {
    assertenum($('chk_1', 'chk_2'), $$('#troubleForm2 input[name="brackets[5][]"]'));
    assertenum([$('chk_1')], $$('#troubleForm2 input[name="brackets[5][]"]:checked'));
    assertenum([$('chk_2')], $$('#troubleForm2 input[name="brackets[5][]"][value=2]'));
    try{
      $$('#troubleForm2 input[name=brackets[5][]]');
      assert(false,'Error Not thrown')
    } catch (e){
      info('Selector With Bracket Attribute Value -- Error thrown')
    }
  });
  
  test("$$() With Nested Attribute Selectors", function() {
    assertenum([$('strong')], $$('div[style] p[id] strong'), 'div[style] p[id] strong');
  });
  
  test("Selector With Multiple Conditions", function() {
    assertenum([$('link_3')], $$('a[class~=external][href="#"]'),
     'a[class~=external][href="#"]');
    assertenum([], $$('a[class~=external][href!="#"]'),
     'a[class~=external][href!="#"]');
  });
  
  test("Selector Match Elements", function() {
    assertElementsMatch(Selector.matchElements($('list').descendants(), 'li'), '#item_1', '#item_2', '#item_3');
    assertElementsMatch(Selector.matchElements($('fixtures').descendants(), 'a.internal'), '#link_1', '#link_2');
    assertenum([], Selector.matchElements($('fixtures').descendants(), 'p.last'));
    assertElementsMatch(Selector.matchElements($('fixtures').descendants(), '.inexistant, a.internal'), '#link_1', '#link_2');
  });
  
  test("Selector Find Element", function() {
    assertElementsMatch([Selector.findElement($('list').descendants(), 'li')], 'li#item_1.first');
    assertElementsMatch([Selector.findElement($('list').descendants(), 'li', 1)], 'li#item_2');
    assertElementsMatch([Selector.findElement($('list').descendants(), 'li#item_3')], 'li');
    assert.equal(undefined, Selector.findElement($('list').descendants(), 'em'));
  });
  
  test("Element Match", function() {
    var span = $('dupL1');
    
    // tests that should pass
    assert(span.match('span'));
    assert(span.match('span#dupL1'));
    assert(span.match('div > span'), 'child combinator');
    assert(span.match('#dupContainer span'), 'descendant combinator');      
    assert(span.match('#dupL1'), 'ID only');
    assert(span.match('span.span_foo'), 'class name 1');
    assert(span.match('span.span_bar'), 'class name 2');
    assert(span.match('span:first-child'), 'first-child pseudoclass');
    
    assert(!span.match('span.span_wtf'), 'bogus class name');
    assert(!span.match('#dupL2'), 'different ID');
    assert(!span.match('div'), 'different tag name');
    assert(!span.match('span span'), 'different ancestry');
    assert(!span.match('span > span'), 'different parent');
    assert(!span.match('span:nth-child(5)'), 'different pseudoclass');
    
    assert(!$('link_2').match('a[rel^=external]'));
    assert($('link_1').match('a[rel^=external]'));
    assert($('link_1').match('a[rel^="external"]'));
    assert($('link_1').match("a[rel^='external']"));
    
    assert(span.match({ match: function(element) { return true }}), 'custom selector');
    assert(!span.match({ match: function(element) { return false }}), 'custom selector');
  });

  test("Selector With Space In Attribute Value", function() {
    assertenum([$('with_title')], $$('cite[title="hello world!"]'));
  });
  
  // AND NOW COME THOSE NEW TESTS AFTER ANDREW'S REWRITE!

  test("Selector With Child", function(done) {
    assertenum($('link_1', 'link_2'), $$('p.first > a'));
    assertenum($('father', 'uncle'), $$('div#grandfather > div'));
    assertenum($('level2_1', 'level2_2'), $$('#level1>span'));
    assertenum($('level2_1', 'level2_2'), $$('#level1 > span'));
    assertenum($('level3_1', 'level3_2'), $$('#level2_1 > *'));
    assertenum([], $$('div > #nonexistent'));
    if($RunBenchmarks)
    {
      setTimeout(function(){
        benchmark(function() { $$('#level1 > span') }, 1000);
        done();
      },500)
    }
    done();
  });

  test("Selector With Adjacence", function(done) {
    assertenum([$('uncle')], $$('div.brothers + div.brothers'));
    assertenum([$('uncle')], $$('div.brothers + div'));      
    assert.equal($('level2_2'), reduce($$('#level2_1+span')));
    assert.equal($('level2_2'), reduce($$('#level2_1 + span')));
    assert.equal($('level2_2'), reduce($$('#level2_1 + *')));
    assertenum([], $$('#level2_2 + span'));
    assert.equal($('level3_2'), reduce($$('#level3_1 + span')));
    assert.equal($('level3_2'), reduce($$('#level3_1 + *')));
    assertenum([], $$('#level3_2 + *'));
    assertenum([], $$('#level3_1 + em'));
    if($RunBenchmarks)
    {
      setTimeout(function() {
        benchmark(function() { $$('#level3_1 + span') }, 1000);
        done();
      },500);
    }
    done();
  });

  test("Selector With Later Sibling", function(done) {
    assertenum([$('list')], $$('#fixtures h1 ~ ul'));
    assert.equal($('level2_2'), reduce($$('#level2_1 ~ span')));
    assertenum($('level2_2', 'level2_3'), reduce($$('#level2_1 ~ *')));
    assertenum([], $$('#level2_2 ~ span'));
    assertenum([], $$('#level3_2 ~ *'));
    assertenum([], $$('#level3_1 ~ em'));
    assertenum([$('level3_2')], $$('#level3_1 ~ #level3_2'));
    assertenum([$('level3_2')], $$('span ~ #level3_2'));
    assertenum([], $$('div ~ #level3_2'));
    assertenum([], $$('div ~ #level2_3'));
    if($RunBenchmarks)
    {
      setTimeout(function(){
        benchmark(function(){ $$('#level2_1 ~ span') }, 1000 );
        done();
      },500)
    }
    else
    {
      done()
    }
  });

  test("Selector With New Attribute Operators", function(done) {
    assertenum($('father', 'uncle'), $$('div[class^=bro]'), 'matching beginning of string');
    assertenum($('father', 'uncle'), $$('div[class$=men]'), 'matching end of string');
    assertenum($('father', 'uncle'), $$('div[class*="ers m"]'), 'matching substring')
    assertenum($('level2_1', 'level2_2', 'level2_3'), $$('#level1 *[id^="level2_"]'));
    assertenum($('level2_1', 'level2_2', 'level2_3'), $$('#level1 *[id^=level2_]'));
    assertenum($('level2_1', 'level3_1'), $$('#level1 *[id$="_1"]'));
    assertenum($('level2_1', 'level3_1'), $$('#level1 *[id$=_1]'));
    assertenum($('level2_1', 'level3_2', 'level2_2', 'level2_3'), $$('#level1 *[id*="2"]'));
    assertenum($('level2_1', 'level3_2', 'level2_2', 'level2_3'), $$('#level1 *[id*=2]'));
    if($RunBenchmarks)
    {
      setTimeout(function() {
        benchmark(function() { $$('#level1 *[id^=level2_]') }, 1000, '[^=]');
        benchmark(function() { $$('#level1 *[id$=_1]') }, 1000, '[$=]');
        benchmark(function() { $$('#level1 *[id*=_2]') }, 1000, '[*=]');
        done();
      },500);
    }
    done();
  });

  test("Selector With Duplicates", function(done) {
    assertenum($$('div div'), $$('div div').uniq());
    assertenum($('dupL2', 'dupL3', 'dupL4', 'dupL5'), $$('#dupContainer span span'));
    if($RunBenchmarks)
    {
      setTimeout(function() {
        benchmark(function() { $$('#dupContainer span span') }, 1000);
        done();
      },500);
    }
    done();
  });

  test("Selector With First Last Only Nth Nth Last Child", function() {
    assertenum([$('level2_1')], $$('#level1>*:first-child'));
    assertenum($('level2_1', 'level3_1', 'level_only_child'), $$('#level1 *:first-child'));
    assertenum([$('level2_3')], $$('#level1>*:last-child'));
    assertenum($('level3_2', 'level_only_child', 'level2_3'), $$('#level1 *:last-child'));
    assertenum([$('level2_3')], $$('#level1>div:last-child'));
    assertenum([$('level2_3')], $$('#level1 div:last-child'));
    assertenum([], $$('#level1>div:first-child'));
    assertenum([], $$('#level1>span:last-child'));
    assertenum($('level2_1', 'level3_1'), $$('#level1 span:first-child'));
    assertenum([], $$('#level1:first-child'));
    assertenum([], $$('#level1>*:only-child'));
    assertenum([$('level_only_child')], $$('#level1 *:only-child'));
    assertenum([], $$('#level1:only-child'));
    assertenum([$('link_2')], $$('#p *:nth-last-child(2)'), 'nth-last-child');
    assertenum([$('link_2')], $$('#p *:nth-child(3)'), 'nth-child');
    assertenum([$('link_2')], $$('#p a:nth-child(3)'), 'nth-child');
    assertenum($('item_2', 'item_3'), $$('#list > li:nth-child(n+2)'));
    assertenum($('item_1', 'item_2'), $$('#list > li:nth-child(-n+2)'));
    if($RunBenchmarks)
    {
      setTimeout(function() {
        benchmark(function() { $$('#level1 *:first-child') }, 1000, ':first-child');
        benchmark(function() { $$('#level1 *:last-child') }, 1000, ':last-child');
        benchmark(function() { $$('#level1 *:only-child') }, 1000, ':only-child');
      },500);
    }
  });
  
  test("Selector With First Last Nth Nth Last Of Type", function() {
    assertenum([$('link_2')], $$('#p a:nth-of-type(2)'), 'nth-of-type');
    assertenum([$('link_1')], $$('#p a:nth-of-type(1)'), 'nth-of-type');
    assertenum([$('link_2')], $$('#p a:nth-last-of-type(1)'), 'nth-last-of-type');
    assertenum([$('link_1')], $$('#p a:first-of-type'), 'first-of-type');
    assertenum([$('link_2')], $$('#p a:last-of-type'), 'last-of-type');
  });
  
  test("Selector With Not", function() {
    assertenum([$('link_2')], $$('#p a:not(a:first-of-type)'), 'first-of-type');
    assertenum([$('link_1')], $$('#p a:not(a:last-of-type)'), 'last-of-type');
    assertenum([$('link_2')], $$('#p a:not(a:nth-of-type(1))'), 'nth-of-type');
    assertenum([$('link_1')], $$('#p a:not(a:nth-last-of-type(1))'), 'nth-last-of-type');
    assertenum([$('link_2')], $$('#p a:not([rel~=nofollow])'), 'attribute 1');
    assertenum([$('link_2')], $$('#p a:not(a[rel^=external])'), 'attribute 2');
    assertenum([$('link_2')], $$('#p a:not(a[rel$=nofollow])'), 'attribute 3');
    assertenum([$('em')], $$('#p a:not(a[rel$="nofollow"]) > em'), 'attribute 4')
    assertenum([$('item_2')], $$('#list li:not(#item_1):not(#item_3)'), 'adjacent :not clauses');
    assertenum([$('son')], $$('#grandfather > div:not(#uncle) #son'));
    assertenum([$('em')], $$('#p a:not(a[rel$="nofollow"]) em'), 'attribute 4 + all descendants');
    assertenum([$('em')], $$('#p a:not(a[rel$="nofollow"])>em'), 'attribute 4 (without whitespace)');
  });
  
  test("Selector With Enabled Disabled Checked", function() {
    assertenum([$('disabled_text_field')], $$('#troubleForm > *:disabled'), ':disabled');
    assertenum($('troubleForm').getInputs().without($('disabled_text_field')), $$('#troubleForm > *:enabled'), ':enabled');
    assertenum($('checked_box', 'checked_radio'), $$('#troubleForm *:checked'), ':checked');
  });
  
  test("Selector With Empty", function() {
    $('level3_1').innerHTML = "";
    if(!IE8)
    {
      assertenum($('level3_1', 'level3_2', 'level2_3'), $$('#level1 *:empty'), '#level1 *:empty');
      assertenum([], $$('#level_only_child:empty'), 'newlines count as content!');
    }
    else
    {
      console.log('IE8 fails these, expected');
    }
  });
  
  test("Identical Results From Equivalent Selectors", function() {
    assertenum($$('div.brothers'), $$('div[class~=brothers]'));
    assertenum($$('div.brothers'), $$('div[class~=brothers].brothers'));
    assertenum($$('div:not(.brothers)'), $$('div:not([class~=brothers])'));
    assertenum($$('li ~ li'), $$('li:not(:first-child)'));
    assertenum($$('ul > li'), $$('ul > li:nth-child(n)'));
    assertenum($$('ul > li:nth-child(even)'), $$('ul > li:nth-child(2n)'));
    assertenum($$('ul > li:nth-child(odd)'), $$('ul > li:nth-child(2n+1)'));
    assertenum($$('ul > li:first-child'), $$('ul > li:nth-child(1)'));
    assertenum($$('ul > li:last-child'), $$('ul > li:nth-last-child(1)'));
    assertenum($$('ul > li:nth-child(n-999)'), $$('ul > li'));
    assertenum($$('ul>li'), $$('ul > li'));
    assertenum($$('#p a:not(a[rel$="nofollow"])>em'), $$('#p a:not(a[rel$="nofollow"]) > em'))
  });
  
  test("Selectors That Should Return Nothing", function() {
    assertenum([], $$('span:empty > *'));
    assertenum([], $$('div.brothers:not(.brothers)'));
    assertenum([], $$('#level2_2 :only-child:not(:last-child)'));
    assertenum([], $$('#level2_2 :only-child:not(:first-child)'));
  });

  test("Commas For $$()", function() {
    assertenum($('p', 'link_1', 'list', 'item_1', 'item_3', 'troubleForm'), $$('#list, .first, #item_3, #troubleForm'));
    assertenum($('p', 'link_1', 'list', 'item_1', 'item_3', 'troubleForm'), $$('#list, .first', '#item_3, #troubleForm'));
    assertenum($('commaParent', 'commaChild'), $$('form[title*="commas,"], input[value="#commaOne,#commaTwo"]'));
    assertenum($('commaParent', 'commaChild'), $$('form[title*="commas,"]', 'input[value="#commaOne,#commaTwo"]'));
  });
  
  test("Selector Extends All Nodes", function(){
    var element = document.createElement('div');
    (3).times(function(){
      element.appendChild(document.createElement('div'));
    });
    element.setAttribute('id','scratch_element');
    $$('body')[0].appendChild(element);
    
    var results = $$('#scratch_element div');
    assert(typeof results[0].show == 'function');
    assert(typeof results[1].show == 'function');
    assert(typeof results[2].show == 'function');
  });
  
  test("Copied Nodes Get Included", function() {
    assertElementsMatch(
      Selector.matchElements($('counted_container').descendants(), 'div'),
      'div.is_counted'
    );
    $('counted_container').innerHTML += $('counted_container').innerHTML;
    assertElementsMatch(
      Selector.matchElements($('counted_container').descendants(), 'div'), 'div.is_counted', 
      'div.is_counted'
    );
  });

  test("Selector Not Inserted Nodes", function() {
    window.debug = true;
    var wrapper = new Element("div");
    wrapper.update("<table><tr><td id='myTD'></td></tr></table>");
    assert(wrapper.select('[id=myTD]')[0],'selecting: [id=myTD]');
    assert(wrapper.select('#myTD')[0],'selecting: #myTD');
    assert(wrapper.select('td')[0],'selecting: td');
    assert($$('#myTD').length == 0,'should not turn up in document-rooted search');
    window.debug = false;
  });
  
  test("Element.down()", function() {
    var a = $('dupL4'); 
    var b = $('dupContainer').down('#dupL4');
    
    assert.equal(a, b);
  });
  test("Element.down() With Dot And Colon", function() {
    var a = $('dupL4_dotcolon'); 
    var b = $('dupContainer.withdot:active').down('#dupL4_dotcolon');    
    var c = $('dupContainer.withdot:active').select('#dupL4_dotcolon');
    
    assert.equal(a, b);
    assertenum([a], c);
  });
  
  test("Descendant Selector Buggy", function() {
    var el = document.createElement('div');
    el.innerHTML = '<ul><li></li></ul><div><ul><li></li></ul></div>';
    document.body.appendChild(el);
    assert.equal(2, $(el).select('ul li').length);
    document.body.removeChild(el);
  });
  
  test("Find Element With Index When Elements Are Not In Document Order", function() {
    var ancestors = $("target_1").ancestors();
    assert.equal($("container_2"), Selector.findElement(ancestors, "[container], .container", 0));
    assert.equal($("container_1"), Selector.findElement(ancestors, "[container], .container", 1));
  });
});