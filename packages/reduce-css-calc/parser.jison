/* description: Parses expressions. */

/* lexical grammar */
%lex
%%
(--[0-9a-z-A-Z-]*)                     return 'CSS_CPROP';
\s+                                    /* skip whitespace */
"*"                                    return 'MUL';
"/"                                    return 'DIV';
"+"                                    return 'ADD';
"-"                                    return 'SUB';

([0-9]+("."[0-9]*)?|"."[0-9]+)px\b     return 'LENGTH';
([0-9]+("."[0-9]*)?|"."[0-9]+)cm\b     return 'LENGTH';
([0-9]+("."[0-9]*)?|"."[0-9]+)mm\b     return 'LENGTH';
([0-9]+("."[0-9]*)?|"."[0-9]+)in\b     return 'LENGTH';
([0-9]+("."[0-9]*)?|"."[0-9]+)pt\b     return 'LENGTH';
([0-9]+("."[0-9]*)?|"."[0-9]+)pc\b     return 'LENGTH';
([0-9]+("."[0-9]*)?|"."[0-9]+)deg\b    return 'ANGLE';
([0-9]+("."[0-9]*)?|"."[0-9]+)grad\b   return 'ANGLE';
([0-9]+("."[0-9]*)?|"."[0-9]+)rad\b    return 'ANGLE';
([0-9]+("."[0-9]*)?|"."[0-9]+)turn\b   return 'ANGLE';
([0-9]+("."[0-9]*)?|"."[0-9]+)s\b      return 'TIME';
([0-9]+("."[0-9]*)?|"."[0-9]+)ms\b     return 'TIME';
([0-9]+("."[0-9]*)?|"."[0-9]+)Hz\b     return 'FREQ';
([0-9]+("."[0-9]*)?|"."[0-9]+)kHz\b    return 'FREQ';
([0-9]+("."[0-9]*)?|"."[0-9]+)dpi\b    return 'RES';
([0-9]+("."[0-9]*)?|"."[0-9]+)dpcm\b   return 'RES';
([0-9]+("."[0-9]*)?|"."[0-9]+)dppx\b   return 'RES';
([0-9]+("."[0-9]*)?|"."[0-9]+)em\b     return 'EMS';
([0-9]+("."[0-9]*)?|"."[0-9]+)ex\b     return 'EXS';
([0-9]+("."[0-9]*)?|"."[0-9]+)ch\b     return 'CHS';
([0-9]+("."[0-9]*)?|"."[0-9]+)rem\b    return 'REMS';
([0-9]+("."[0-9]*)?|"."[0-9]+)vw\b     return 'VWS';
([0-9]+("."[0-9]*)?|"."[0-9]+)vh\b     return 'VHS';
([0-9]+("."[0-9]*)?|"."[0-9]+)vmin\b   return 'VMINS';
([0-9]+("."[0-9]*)?|"."[0-9]+)vmax\b   return 'VMAXS';
([0-9]+("."[0-9]*)?|"."[0-9]+)\%       return 'PERCENTAGE';
([0-9]+("."[0-9]*)?|"."[0-9]+)\b       return 'NUMBER';

(calc)                                 return 'NESTED_CALC';
(var)                                  return 'CSS_VAR';
(max)                                  return 'MAX';
(min)                                  return 'MIN';
([a-z]+)                               return 'PREFIX';

"("                                    return 'LPAREN';
")"                                    return 'RPAREN';
","                                    return 'COMMA';

<<EOF>>                                return 'EOF';

/lex

%left ADD SUB
%left MUL DIV
%left UPREC


%start expression

%%

expression
	: math_expression EOF { return $1; }
  ;

  math_expression
  	: math_expression ADD math_expression { $$ = { type: 'MathExpression', operator: $2, left: $1, right: $3 }; }
  	| math_expression SUB math_expression { $$ = { type: 'MathExpression', operator: $2, left: $1, right: $3 }; }
  	| math_expression MUL math_expression { $$ = { type: 'MathExpression', operator: $2, left: $1, right: $3 }; }
  	| math_expression DIV math_expression { $$ = { type: 'MathExpression', operator: $2, left: $1, right: $3 }; }
  	| LPAREN math_expression RPAREN { $$ = $2; }
    | NESTED_CALC LPAREN math_expression RPAREN { $$ = { type: 'Calc', value: $3 }; }
    | MAX LPAREN math_expression COMMA math_expression RPAREN { $$ = { type: 'MathExpression', operator: 'max', left: $3, right: $5 }; }
    | MIN LPAREN math_expression COMMA math_expression RPAREN { $$ = { type: 'MathExpression', operator: 'min', left: $3, right: $5 }; }
    | SUB PREFIX SUB NESTED_CALC LPAREN math_expression RPAREN { $$ = { type: 'Calc', value: $6, prefix: $2 }; }
    | css_variable { $$ = $1; }
  	| css_value { $$ = $1; }
  	| value { $$ = $1; }
    ;

  value
  	: NUMBER { $$ = { type: 'Value', value: parseFloat($1) }; }
  	| SUB NUMBER { $$ = { type: 'Value', value: parseFloat($2) * -1 }; }
  	;

  css_variable
    : CSS_VAR LPAREN CSS_CPROP RPAREN { $$ = { type: 'CssVariable', value: $3 }; }
    | CSS_VAR LPAREN CSS_CPROP COMMA math_expression RPAREN { $$ = { type: 'CssVariable', value: $3, fallback: $5 }; }
    ;

  css_value
  	: LENGTH { $$ = { type: 'LengthValue', value: parseFloat($1), unit: /[a-z]+/.exec($1)[0] }; }
  	| ANGLE { $$ = { type: 'AngleValue', value: parseFloat($1), unit: /[a-z]+/.exec($1)[0] }; }
  	| TIME { $$ = { type: 'TimeValue', value: parseFloat($1), unit: /[a-z]+/.exec($1)[0] }; }
  	| FREQ { $$ = { type: 'FrequencyValue', value: parseFloat($1), unit: /[a-z]+/.exec($1)[0] }; }
  	| RES { $$ = { type: 'ResolutionValue', value: parseFloat($1), unit: /[a-z]+/.exec($1)[0] }; }
  	| EMS { $$ = { type: 'EmValue', value: parseFloat($1), unit: 'em' }; }
  	| EXS { $$ = { type: 'ExValue', value: parseFloat($1), unit: 'ex' }; }
  	| CHS { $$ = { type: 'ChValue', value: parseFloat($1), unit: 'ch' }; }
  	| REMS { $$ = { type: 'RemValue', value: parseFloat($1), unit: 'rem' }; }
  	| VHS { $$ = { type: 'VhValue', value: parseFloat($1), unit: 'vh' }; }
  	| VWS { $$ = { type: 'VwValue', value: parseFloat($1), unit: 'vw' }; }
  	| VMINS { $$ = { type: 'VminValue', value: parseFloat($1), unit: 'vmin' }; }
  	| VMAXS { $$ = { type: 'VmaxValue', value: parseFloat($1), unit: 'vmax' }; }
  	| PERCENTAGE { $$ = { type: 'PercentageValue', value: parseFloat($1), unit: '%' }; }
  	| SUB css_value { var prev = $2; prev.value *= -1; $$ = prev; }
    ;
