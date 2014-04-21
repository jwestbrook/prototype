suite("Form Interactions",function(){
  this.timeout(5000);
  
  // Make sure to set defaults in the test forms, as some browsers override this
  // with previously entered values on page reload
  setup(function(){
    $$('form').each(function(f){ f.reset() });
    // hidden value does not reset (for some reason)
    $('bigform')['tf_hidden'].value = '';
  });
  
  test("$F() method", function(){
    assert.equal("4", $F("input_enabled"));
  });
  
  test("Form Reset", function() {
    assert(!Object.isUndefined(Form.reset('form').reset));
  });
  
  test("Form Element Event Observer", function(){
    var callbackCounter = 0;
    var observer = new Form.Element.EventObserver('input_enabled', function(){
      callbackCounter++;
    });
    
    assert.equal(0, callbackCounter);
    $('input_enabled').value = 'boo!';
    observer.onElementEvent(); // can't test the event directly, simulating
    assert.equal(1, callbackCounter);
  });

  test("Form Element Observer", function(done){
    var timedCounter1 = 0;
    // First part: regular field
    var observer = new Form.Element.Observer('input_enabled', 0.5, function() {
      ++timedCounter1;
    });

    // Test it's unchanged yet
    assert.equal(timedCounter1,0);
    // Test it doesn't change on first check
    setTimeout(function() {
      assert.equal(timedCounter1,0);
      // Change, test it doesn't immediately change
      $('input_enabled').value = 'yowza!';
      assert.equal(timedCounter1,0);
      // Test it changes on next check, but not again on the next
      setTimeout(function() {
        assert.equal(timedCounter1,1);
        setTimeout(function() {
          assert.equal(timedCounter1,1);
          observer.stop();
        },550);
      },550);
    },550);

    // Second part: multiple-select
    [1, 2, 3].each(function(index) {
      $('multiSel1_opt' + index).selected = (1 == index);
    });
    var timedCounter = 0;
    observer = new Form.Element.Observer('multiSel1', 0.5, function() {
      ++timedCounter;
    });

    // Test it's unchanged yet
    assert.equal(timedCounter,0);
    // Test it doesn't change on first check
    setTimeout(function() {
      assert.equal(timedCounter,0);
      // Change, test it doesn't immediately change
      // NOTE: it is important that the 3rd be re-selected, for the
      // serialize form to obtain the expected value :-)
      $('multiSel1_opt3').selected = true;
      assert.equal(timedCounter,0);
      // Test it changes on next check, but not again on the next
      setTimeout(function() {
        assert.equal(1, timedCounter);
        setTimeout(function() {
          assert.equal(1, timedCounter);
          observer.stop();
          done()
        },550);
      },550);
    },550);
  });
  
  test("Form Observer", function(done){
    var timedCounter = 0;
    // should work the same way was Form.Element.Observer
    var observer = new Form.Observer('form', 0.5, function(form, value) {
      ++timedCounter;
    });

    // Test it's unchanged yet
    assert.equal(0, timedCounter);
    // Test it doesn't change on first check
    setTimeout(function() {
      assert.equal(0, timedCounter);
      // Change, test it doesn't immediately change
      $('input_enabled').value = 'yowza!';
      assert.equal(0, timedCounter);
      // Test it changes on next check, but not again on the next
      setTimeout(function() {
        assert.equal(1, timedCounter);
        setTimeout(function() {
          assert.equal(1, timedCounter);
          observer.stop();
          done()
        },550);
      },550);
    },550);
  });
  
  test("Form Enabling", function(){
    var form = $('bigform')
    var input1 = $('dummy_disabled');
    var input2 = $('focus_text');
    
    assertDisabled(input1);
    assertEnabled(input2);
    
    form.disable();
    assertDisabled(input1, input2);
    form.enable();
    assertEnabled(input1, input2);
    input1.disable();
    assertDisabled(input1);
    
    // non-form elements:
    var fieldset = $('selects_fieldset');
    var fields = fieldset.immediateDescendants();
    fields.each(function(select) { assertEnabled(select) }, this);
    
    Form.disable(fieldset)
    fields.each(function(select) { assertDisabled(select) }, this);
    
    Form.enable(fieldset)
    fields.each(function(select) { assertEnabled(select) }, this);
  });
  
  test("Form Element Enabling", function(){
    var field = $('input_disabled');
    field.enable();
    assertEnabled(field);
    field.disable();
    assertDisabled(field);
    
    var field = $('input_enabled');
    assertEnabled(field);
    field.disable();
    assertDisabled(field);
    field.enable();
    assertEnabled(field);
  });

  // due to the lack of a DOM hasFocus() API method,
  // we're simulating things here a little bit
  test("Form Activating", function(){
    // Firefox, IE, and Safari 2+
    function getSelection(element){
      try {
        if (typeof element.selectionStart == 'number') {
          return element.value.substring(element.selectionStart, element.selectionEnd);
        } else if (document.selection && document.selection.createRange) {
          return document.selection.createRange().text;
        }
      }
      catch(e){ return null }
    }
    
    var element = Form.findFirstElement('bigform');
    assert.equal('submit', element.id, "Form.focusFirstElement shouldn't focus disabled elements");
    
    Form.focusFirstElement('bigform');
    if (document.selection) assert.equal('', getSelection(element), "IE shouldn't select text on buttons");
    
    element = $('focus_text');
    assert.equal('', getSelection(element), "Form.Element.activate shouldn't select text on buttons");
      
    element.activate();
    assert.equal('Hello', getSelection(element), "Form.Element.activate should select text on text input elements");

    assert.doesNotThrow(function() {
      $('form_focus_hidden').focusFirstElement();
    }, "Form.Element.activate shouldn't raise an exception when the form or field is hidden");
    
    assert.doesNotThrow(function() {
      $('form_empty').focusFirstElement();
    }, "Form.focusFirstElement shouldn't raise an exception when the form has no fields");
  });
  
  test("Form.getElements()", function() {
    var elements = Form.getElements('various'),
      names = $w('tf_selectOne tf_textarea tf_checkbox tf_selectMany tf_text tf_radio tf_hidden tf_password tf_button');
    assertenum(names, elements.pluck('name'))
  });
  
  test("Form.getInputs()", function() {
    var form = $('form');
    [form.getInputs(), Form.getInputs(form)].each(function(inputs){
      assert.equal(inputs.length, 5);
      assert(inputs instanceof Array);
      assert(inputs.all(function(input) { return (input.tagName == "INPUT"); }));
    });
  });

  test("Form.findFirstElement()", function() {
    assert.equal($('ffe_checkbox'), $('ffe').findFirstElement());
    assert.equal($('ffe_ti_submit'), $('ffe_ti').findFirstElement());
    assert.equal($('ffe_ti2_checkbox'), $('ffe_ti2').findFirstElement());
  });
  
  test("Form.serialize()", function() {
    // form is initially empty
    var form = $('bigform');
    var expected = {
      tf_selectOne: '',
      tf_textarea:  '',
      tf_text:      '',
      tf_hidden:    '',
      tf_password:  '',
      tf_button:    ''
    };
    
    assertHashEqual(expected, Form.serialize('various', true));
      
    // set up some stuff
    form['tf_selectOne'].selectedIndex = 1;
    form['tf_textarea'].value = "boo hoo!";
    form['tf_text'].value = "123öäü";
    form['tf_hidden'].value = "moo%hoo&test";
    form['tf_password'].value = 'sekrit code';
    form['tf_button'].value = 'foo bar';
    form['tf_checkbox'].checked = true;
    form['tf_radio'].checked = true;
    
    var expected = {
      tf_selectOne: 1, tf_textarea: "boo hoo!",
      tf_text: "123öäü",
      tf_hidden: "moo%hoo&test",
      tf_password: 'sekrit code',
      tf_button: 'foo bar',
      tf_checkbox: 'on',
      tf_radio: 'on'
    };

    // return params
    assertHashEqual(expected, Form.serialize('various', true), "test the whole form (as a hash)");
    // return string
    assertenum(Object.toQueryString(expected).split('&').sort(),
                    Form.serialize('various').split('&').sort(), "test the whole form (as a string)");
    assert.equal('string', typeof $('form').serialize({ hash:false }));

    // Checks that disabled element is not included in serialized form.
    $('input_enabled').enable();
    assertHashEqual({ val1:4, action:'blah', first_submit:'Commit it!' },
                    $('form').serialize(true));

    // should not eat empty values for duplicate names 
    $('checkbox_hack').checked = false;
    var data = Form.serialize('value_checks', true); 
    assertenum(['', 'siamese'], data['twin']); 
    assert.equal('0', data['checky']);
    
    $('checkbox_hack').checked = true; 
    assertenum($w('1 0'), Form.serialize('value_checks', true)['checky']);

    // all kinds of SELECT controls
    var params = Form.serialize('selects_fieldset', true);
    var expected = { 'nvm[]':['One', 'Three'], evu:'', 'evm[]':['', 'Three'] };
    assertHashEqual(expected, params);
    params = Form.serialize('selects_wrapper', true);
    assertHashEqual(Object.extend(expected, { vu:1, 'vm[]':[1, 3], nvu:'One' }), params);

    // explicit submit button
    assertHashEqual({ val1:4, action:'blah', second_submit:'Delete it!' },
                    $('form').serialize({ submit: 'second_submit' }));
    assertHashEqual({ val1:4, action:'blah' },
                    $('form').serialize({ submit: false }));
    assertHashEqual({ val1:4, action:'blah' },
                    $('form').serialize({ submit: 'inexistent' }));

    // file input should not be serialized  
    assert.equal('', $('form_with_file_input').serialize());   
  });
  
  test("Form.serialize() With Duplicate Names", function() {
    assert.equal("fact=sea-wet&opinion=sea-cold&fact=sun-hot&opinion=sun-ugly", $('form_with_duplicate_input_names').serialize(false));
  });
  
  test("Form.serialize() URIEncodes Inputs", function() {
    assert.equal("user%5Bwristbands%5D%5B+%5D%5Bnickname%5D=H%C3%A4sslich", $('form_with_inputs_needing_encoding').serialize(false));
  });
  
  test("Form Methods On Extended Elements", function() {
    var form = $('form');
    assert.equal(Form.serialize('form'), form.serialize());
    assert.equal(Form.Element.serialize('input_enabled'), $('input_enabled').serialize());
    assert.notEqual(form.serialize, $('input_enabled').serialize);
    
    Element.addMethods('INPUT',  { anInputMethod: function(input)  { return 'input'  } });
    Element.addMethods('SELECT', { aSelectMethod: function(select) { return 'select' } });

    form = $('bigform');
    var input = form['tf_text'], select = form['tf_selectOne'];
    input._extendedByPrototype = select._extendedByPrototype = void 0;
    
    assert($(input).anInputMethod);
    assert(!input.aSelectMethod);
    assert.equal('input', input.anInputMethod());

    assert($(select).aSelectMethod);
    assert(!select.anInputMethod);      
    assert.equal('select', select.aSelectMethod());
  });

  test("Form.serialize() Multiple Select", function () {
    var form = $("form_with_multiple_select");
    assert.equal(
      form.serialize(false),
      "peewee=herman&colors=pink&colors=blue&colors=yellow&colors=not+grey&number=2"
    );
    var hash = {
      peewee: 'herman',
      colors: ['pink', 'blue', 'yellow', 'not grey'],
      number: '2'
    };
    assert.equal(
      JSON.stringify(form.serialize(true)),
      JSON.stringify(hash)
    );
  });

  test("Form.serialize() With Nested Attributes", function() {
    var form = $("form_with_nested_attributes");
    var expectedStr = "foo[name]=Foo+1&foo[combined_weight]=250+lbs&foo[bars][][name]=Bar+1&foo[bars][][weight]=100+lbs&foo[bars][][tax]=&foo[bars][][name]=Bar+2&foo[bars][][weight]=150+lbs&foo[bars][][tax]=1";
    var decodedStr = decodeURIComponent(form.serialize(false));
    assert.equal(expectedStr, decodedStr);
    var expectedHash = {
      'foo[name]': 'Foo 1',
      'foo[combined_weight]': '250 lbs',
      'foo[bars]': [
        {'name': 'Bar 1', 'weight': '100 lbs', 'tax': ''},
        {'name': 'Bar 2', 'weight': '150 lbs', 'tax': '1'}
      ]
    }
    var actualHash = form.serialize(true);
    assert.equal(typeof actualHash['foo[bars]'], 'object');
    assert.equal(JSON.stringify(actualHash), JSON.stringify(expectedHash));
  });
  
  test("Form.request()", function(done) {
    var request = $("form").request();
    assert($("form").hasAttribute("method"));
    assert(request.url.include("ajaxtest_assets/empty.js?val1=4"));
    assert.equal("get", request.method);
    
    request = $("form").request({ method: "put", parameters: {val2: "hello"} });
    assert(request.url.endsWith("ajaxtest_assets/empty.js"));
    assert.equal(4, request.options.parameters['val1']);
    assert.equal('hello', request.options.parameters['val2']);
    assert.equal("post", request.method);
    assert.equal("put", request.parameters['_method']);

    // with empty action attribute
    request = $("ffe").request({ method: 'post' });
    assert(request.url.include("/test/formtests.html"),
      'wrong default action for form element with empty action attribute');
    setTimeout(function(){
      done();
    },100);
  });
  
  test("Form Element Methods Chaining", function(){
    var methods = $w('clear activate disable enable'),
      formElements = $('form').getElements();
    methods.each(function(method){
      formElements.each(function(element){
        var returned = element[method]();
        assert.strictEqual(element, returned);
      });
    });
  });

  test("setValue()", function(){
    // text input
    var input = $('input_enabled'), oldValue = input.getValue();
    assert.equal(input, input.setValue('foo'), 'setValue chaining is broken');
    assert.equal('foo', input.getValue(), 'value improperly set');
    input.setValue(oldValue);
    assert.equal(oldValue, input.getValue(), 'value improperly restored to original');

    // checkbox
    input = $('checkbox_hack');
    input.setValue(false);
    assert.equal(null, input.getValue(), 'checkbox should be unchecked');
    input.setValue(true);
    assert.equal("1", input.getValue(), 'checkbox should be checked');
    // selectbox
    input = $('bigform')['vu'];
    input.setValue('3');
    assert.equal('3', input.getValue(), 'single select option improperly set');
    input.setValue('1');
    assert.equal('1', input.getValue());
    // multiple select
    input = $('bigform')['vm[]'];
    input.setValue(['2', '3']);
    assertenum(['2', '3'], input.getValue(),
      'multiple select options improperly set');
    input.setValue(['1', '3']);
    assertenum(['1', '3'], input.getValue());
  });
  
  test("Serialize Form Troublesome Names", function() {
    var hash = { length: 'foo', bar: 'baz' };
    var el = new Element('form', { 
      action: '/' 
    });
    var input = new Element('input', { 
      type: 'text', 
      name: 'length', 
      value: 'foo' 
    });
    var input2 = new Element('input', { 
      type: 'text', 
      name: 'bar', 
      value: 'baz' 
    });
    el.appendChild(input);
    el.appendChild(input2);
    assertHashEqual(hash, el.serialize(true));
    
    var form = $('form_with_troublesome_input_names');
    assertHashEqual(hash, form.serialize(true));
  });
});