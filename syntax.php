<?php
/**
 * DokuWiki Plugin ABC2 (Syntax Component)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  Anika Henke <anika@selfthinker.org>
 */

// must be run within Dokuwiki
if (!defined('DOKU_INC')) {
    die();
}

class syntax_plugin_abc2 extends DokuWiki_Syntax_Plugin
{
    /**
     * @return string Syntax mode type
     */
    public function getType()
    {
        return 'protected';
    }

    /**
     * @return string Paragraph type
     */
    public function getPType()
    {
        return 'block';
    }

    /**
     * @return int Sort order - Low numbers go before high numbers
     */
    public function getSort()
    {
        return 190;
    }

    /**
     * Connect lookup pattern to lexer.
     *
     * @param string $mode Parser mode
     */
    public function connectTo($mode)
    {
        $this->Lexer->addEntryPattern('<abc(?=.*\x3C/abc\x3E)',$mode,'plugin_abc2');
    }

    public function postConnect()
    {
        $this->Lexer->addExitPattern('</abc>','plugin_abc2');
    }

    /**
     * Handle matches of the abc2 syntax
     *
     * @param string       $match   The match of the syntax
     * @param int          $state   The state of the handler
     * @param int          $pos     The position in the document
     * @param Doku_Handler $handler The handler
     *
     * @return array Data for the renderer
     */
    public function handle($match, $state, $pos, Doku_Handler $handler)
    {
        if ( $state == DOKU_LEXER_UNMATCHED ) {
            $matches = preg_split('/>/u',$match,2);
            $matches[0] = trim($matches[0]);
            return array($matches[1],$matches[0]);
        }
        return true;
    }

    /**
     * Render xhtml output or metadata
     *
     * @param string        $mode     Renderer mode (supported modes: xhtml)
     * @param Doku_Renderer $renderer The renderer
     * @param array         $data     The data from the handler() function
     *
     * @return bool If rendering was successful.
     */
    public function render($mode, Doku_Renderer $renderer, $data)
    {
        if ($mode !== 'xhtml') {
            return false;
        }

        if(strlen($data[0]) > 1){
            $src = $data[0];
            $transStr = $data[1];

            // display just the code if 'abcok' is switched off
            if (!$this->getConf('abcok')) {
                $renderer->doc .= $renderer->file($src);
                return true;
            }

            // render the main ABC block
            $containerClasses = $this->_getClasses();
            $showHideClass = $this->getConf('showSource') ? ' show-source' : ' hide-source';
            $this->_renderAbcBlock($renderer, $src, $containerClasses.$showHideClass);

            // transposition
            // via adding `shift=xy` to key information field
            // doesn't work with abcjs this way
            if ($transStr && ($this->getConf('library') !== 'abcjs')) {
                $transArray = $this->_transStringToArray($transStr);

                foreach($transArray as &$trans) {
                    $transShiftStr = $this->_transposeToShift($trans);
                    $keyLine = $this->_getAbcLine($src, 'K');
                    $titleLine = $this->_getAbcLine($src, 'T');

                    // checking for already existing shift|score|sound not necessary
                    // a first 'shift' parameter is ignored
                    // 'score' or 'sound' will cause the score to be transposed further
                    if ($keyLine && $titleLine) {
                        $transSrc = $src;

                        // add shift parameter into key information field
                        $keyLineNoNL = str_replace("\n", '', $keyLine);
                        $keyLineNew = $keyLineNoNL.' shift='.$transShiftStr;
                        $transSrc = $this->_replace_first($transSrc, $keyLineNoNL, $keyLineNew);

                        // add transposition semitone after title
                        $titleLineNoNL = str_replace("\n", '', $titleLine);
                        $titleLineNew = $titleLineNoNL.' ['.$trans.']';
                        $transSrc = $this->_replace_first($transSrc, $titleLineNoNL, $titleLineNew);

                        // render another ABC block per transposition
                        $this->_renderAbcBlock($renderer, $transSrc, $containerClasses.' hide-source');
                    }
                }
            }
        }
        return true;

    }

    /**
     * Get transposition parameters into reasonable array
     *
     * @param string   $str     ABC parameter, string of transposition numbers
     *
     * @return array   Array with transposition numbers
     */
    function _transStringToArray($str) {
        $arr = explode(" ", $str);
        // the semitones to transpose have to be integers
        $arr = array_map("intval", $arr);
        // do not transpose by the same amount of semitones more than once
        $arr = array_unique($arr);
        // do not transpose higher or lower than 12 semitones
        $arr = array_filter($arr, create_function('$t', 'return($t<12 && $t >-12);'));
        // do not allow transposition into more than 8 keys
        array_splice($arr, 8);
        return $arr;
    }

    /**
     * Turn transposition number into 'shift' voice modifier
     *
     * ABC 2.1 had 'transpose' which worked with semitones
     * ABC 2.2 has 'shift' which works with an interval of two notes
     *
     * @param int      $num     transpose, number of semitones
     *
     * @return string  shift, string of two notes
     */
    function _transposeToShift($num) {
        $arr = array(
            0 => 'CC',
            1 => 'Bc',
            2 => 'CD',
            3 => 'Bd',
            4 => 'CE',
            5 => 'CF',
            6 => 'BF',
            7 => 'CG',
            8 => 'Bg',
            9 => 'CA',
            10 => 'Ba',
            11 => 'CB',
            12 => 'Cc',
            -1 => 'cB',
            -2 => 'DC',
            -3 => 'dB',
            -4 => 'EC',
            -5 => 'FC',
            -6 => 'FB',
            -7 => 'GC',
            -8 => 'gB',
            -9 => 'AC',
            -10 => 'aB',
            -11 => 'BC',
            -12 => 'cC',
        );
        return $arr[$num];
    }

    /**
     * Build classes for abc container depending on chosen abc library
     *
     * @return string   CSS classes
     */
    function _getClasses() {
      switch($this->getConf('library')) {
          case 'abcjs':
              // makes the midi player bigger
              $containerClasses = 'abcjs-large';
              break;

          case 'abc2svg':
              // no extra class needed
              break;

          case 'abc-ui':
              // 'abc-source' is mandatory and needs to be first
              $containerClasses = 'abc-source '.$this->getConf('abcuiConfig');
          break;
      }

      // add generic class plus class identifying the chosen library
      $containerClasses .= ' abc2-plugin lib-'.$this->getConf('library');

      return $containerClasses;
    }

    /**
     * Render block of ABC
     *
     * @param Doku_Renderer $renderer The renderer
     * @param string        $src      ABC code source
     * @param string        $classes  CSS classes
     *
     * @return void
     */
    function _renderAbcBlock($renderer, $src, $classes) {
        // needs to be a div, otherwise abc-ui won't work
        $renderer->doc .= '<div class="'.$classes.'">';
        $renderer->doc .= hsc($src);
        // needs NL before </div> or else abc2svg interprets the </div> as abc
        $renderer->doc .= NL.'</div>'.NL;
    }

    /**
     * Get line of ABC with specific information field
     *
     * @param string   $src     ABC code source
     * @param string   $field   ABC information field identifier
     *
     * @return string  information field, whole line
     */
    function _getAbcLine($src, $field) {
        preg_match("/\s?".$field."\s?:(.*?)\n/s", $src, $result);
        return $result[0];
    }

    /**
     * Replace first string
     *
     * @author Zombat [https://stackoverflow.com/users/81205/zombat]
     * @source https://stackoverflow.com/a/1252710/340300
     * @license CC BY-SA 3.0 [https://creativecommons.org/licenses/by-sa/3.0/]
     *
     * @param string   $haystack
     * @param string   $needle
     * @param string   $replace
     *
     * @return string
     */
    function _replace_first($haystack, $needle, $replace) {
        $pos = strpos($haystack, $needle);
        if ($pos !== false) {
            $newstring = substr_replace($haystack, $replace, $pos, strlen($needle));
        }
        return $newstring;
    }

}
