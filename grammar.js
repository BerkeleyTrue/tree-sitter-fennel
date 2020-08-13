module.exports = grammar({
  name: 'fennel',

  rules: {
    program: $ => repeat($._statement),

    _statement: $ => choice(
      $.function_call,
      $._function,
      $._expression,
      $._variable_declaration,
      $._iterator,
      $._conditional
    ),

    _function: $ => choice(
      $.function_definition,
      $.lambda_definition
    ),

    _variable_declaration: $ => choice(
      $.let_definition,
      $.local_definition,
      $.var_definition,
      $.global_definition
    ),

    _iterator: $ => choice(
      $.each,
      $.for,
      $.while
    ),

    _conditional: $ => choice(
      $.if_statement,
      $.when_statement
    ),

    when_statement: $ => seq(
      '(when',
        repeat($._statement),
      ')'
    ),

    if_statement: $ => seq(
      '(if',
        repeat($._statement),
      ')'
    ),

    each: $ => seq(
      '(each',
        $.each_clause,
        repeat($._statement),
      ')'
    ),

    each_clause: $ => seq(
      '[',
        $.identifier,
        $.identifier,
        $.function_call,
      ']'
    ),

    for: $ => seq(
      '(for',
        $.for_clause,
        repeat($._statement),
      ')'
    ),

    for_clause: $ => seq(
      '[',
        $.identifier,
        $._statement,
        $._statement,
        optional($._statement),
      ']'
    ),

    while: $ => seq(
      '(while',
        field('condition', $._statement),
        repeat($._statement),
      ')'
    ),

    let_definition: $ => seq(
      '(let',
        $.assignments,
        repeat($._statement),
      ')'
    ),

    local_definition: $ => seq(
      '(local',
        $.assignment,
      ')'
    ),

    var_definition: $ => seq(
      '(var',
        $.assignment,
      ')'
    ),

    global_definition: $ => seq(
      '(global',
        $.assignment,
      ')'
    ),

    assignments: $ => seq('[', repeat($.assignment), ']'),

    assignment: $ => seq($.identifier, $._statement),

    function_definition: $ => seq(
      '(fn',
        $._function_body,
      ')'
    ),

    lambda_definition: $ => seq(
      '(lambda',
        $._function_body,
      ')'
    ),

    _function_body: $ => seq(
      optional(field('name', $.identifier)),
      $.parameters,
      field('body', repeat($._statement))
    ),

    parameters: $ => seq('[', repeat($._expression), ']'),

    function_call: $ => seq(
      '(',
        field('name', choice($.identifier, alias($._operator, $.identifier))),
        optional(repeat($._statement)),
      ')'
    ),

    sequential_table: $ => seq(
      '[',
        repeat($._expression),
      ']'
    ),

    table: $ => seq(
      '{',
        repeat(
          seq(
            $.string,
            $._statement
          )
        ),
      '}'
    ),

    _expression: $ => choice(
      $.number,
      $.identifier,
      $.string,
      $.table,
      $.sequential_table
    ),

    string: $ => seq(
      '"', repeat(/./), '"'
    ),

    number: $ => /\d+(\.\d+)?/,

    _operator: $ => choice(
      '+',
      '-',
      '*',
      '_',
      '..',
      '.',
      '=',
      '%'
    ),

    identifier: $ => /(\?)?([A-Za-z][\.\?\-A-Za-z0-9]*)/
  }
});
