<?php
/**
 * DokuWiki Plugin abc2 (Action Component)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  Anika Henke <anika@selfthinker.org>
 */

// must be run within Dokuwiki
if (!defined('DOKU_INC')) {
    die();
}

class action_plugin_abc2 extends DokuWiki_Action_Plugin
{

    /**
     * Registers a callback function for a given event
     *
     * @param Doku_Event_Handler $controller DokuWiki's event controller object
     *
     * @return void
     */
    public function register(Doku_Event_Handler $controller)
    {
        global $ACT;

        // only load JS when it is needed
        $allowedAct = array('show', 'preview', 'export_xhtml', 'export_xhtmlbody');
        $showJS = in_array(act_clean($ACT), $allowedAct);
        // abc2svg parses abc wherever it is, including within the edit textarea
        // that is why it cannot be used in preview mode
        if (($this->getConf('library') == 'abc2svg') && (act_clean($ACT) == 'preview')) {
            $showJS = false;
        }

        if ($this->getConf('abcok') && $showJS) {
            $controller->register_hook('TPL_METAHEADER_OUTPUT', 'BEFORE', $this, '_addJavascript');
        }
    }

    /**
     * Add JavaScripts, depending on chosen abc library
     *
     * Called for event: TPL_METAHEADER_OUTPUT
     *
     * @param Doku_Event $event  event object by reference
     *
     * @return void
     */
    public function _addJavascript(Doku_Event $event)
    {
        switch ($this->getConf('library')) {
            case 'abcjs':
                $event->data['script'][] = array(
                    'charset' => 'utf-8',
                    '_data'   => '',
                    'src'     => DOKU_BASE.'lib/plugins/abc2/abc-libraries/abcjs/abcjs_plugin-midi_6.0.0-beta.25-min.js'
                );
            break;

            case 'abc2svg':
                $event->data['script'][] = array(
                    'charset' => 'utf-8',
                    '_data'   => '',
                    'src'     => DOKU_BASE.'lib/plugins/abc2/abc-libraries/abc2svg/abcweb-1.js'
                );
                if (!$this->getConf('stayLibre')) {
                    $event->data['script'][] = array(
                        'charset' => 'utf-8',
                        '_data'   => '',
                        'src'     => DOKU_BASE.'lib/plugins/abc2/abc-libraries/abc2svg/snd-1.js'
                    );
                }
            break;

            case 'abc-ui':
                $event->data['script'][] = array(
                    'charset' => 'utf-8',
                    '_data'   => '',
                    'src'     => DOKU_BASE.'lib/plugins/abc2/abc-libraries/abc-ui/abc-ui-1.0.0.min.js'
                );
            break;
        }
    }

}
