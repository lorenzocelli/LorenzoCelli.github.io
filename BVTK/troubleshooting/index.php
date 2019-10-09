<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="apple-touch-icon" sizes="180x180" href="/BVTK/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/BVTK/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/BVTK/favicon/favicon-16x16.png">
    <link rel="manifest" href="/BVTK/favicon/site.webmanifest">
    <link rel="mask-icon" href="/BVTK/favicon/safari-pinned-tab.svg" color="#5bbad5">
    <link rel="shortcut icon" href="/BVTK/favicon/favicon.ico">
    <meta name="msapplication-TileColor" content="#2b5797">
    <meta name="msapplication-config" content="/BVTK/favicon/browserconfig.xml">
    <meta name="theme-color" content="#ffffff">


    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="../fonts/fonts.css">
    <link rel="stylesheet" type="text/css" href="../shared.css">
    <title>BVTK</title>
    <style>
        .descr_box_outlined {
            position: relative;
        }
        .descr_box_outlined::before{
            pointer-events: none;
            position: absolute;
            top:    2px;
            left:   2px;
            bottom: 2px;
            right:  2px;
            border: 1px solid #ff3333;
            border-radius: 2px;
            content: "";

            -webkit-animation: pulsate 3s infinite ease-in-out;
            -o-animation:      pulsate 3s infinite ease-in-out;
            -ms-animation:     pulsate 3s infinite ease-in-out;
            -moz-animation:    pulsate 3s infinite ease-in-out;
            animation:         pulsate 3s infinite ease-in-out;
        }
        @keyframes pulsate{
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
        }
        @-webkit-keyframes pulsate{
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
        }


        @media only screen and (max-width: 680px) {
            .light_highlight_title{
                font-size: 36px;
            }
            /* ------------------------------------------------------------------------------
                COLLAPSE MENU
            ------------------------------------------------------------------------------ */
            #menu{
                display: block;
            }
            .header_bar{
                height: 43px;
                width: 43px;
                border-radius: 45px;
            }
            .header_bar .button{
                display: block;
                padding-left: 5px;
                border-radius: 5px;
                border: none;
                border-bottom: 2px solid var(--light-gray);
            }
            .header_bar .button.last{
                border: none;
            }
            .header_bar .hor_s_5_5{
                display: none;
            }
            .open_menu{
                height: auto;
                width: auto;
                right: 20px;
                border-radius: 5px;
            }
            .open_menu #menu{
                display: none;
            }
            .header_bar .button:hover .eye_outline{
                transform: scale(0.4);
            }
            .header_bar .button:hover .eye_outline img{
                transform: scale(0);
            }
            #c2 .title{
                font-family: Aileron-Heavy, sans-serif;
                font-size: 50px;
                line-height: 0.9em;
            }
        }

    </style>
</head>
<body>
<div id="wrapper">
    <div class="header_bar"><!--
     --><div class="button" id="menu"><div class="eye_outline"><img src="../media/eye.svg"></div></div><!--
     --><a href="../index.html"><div class="button logo"><div class="eye_outline"><img src="../media/eye.svg"></div>home</div></a><!--
     --><a href="../download/index.html"><div class="button"><div class="eye_outline"><img src="../media/eye.svg"></div><div>download</div></div></a><!--
     --><a href="../presets/index.html"><div class="button"><div class="eye_outline"><img src="../media/eye.svg"></div><div>presets</div></div></a><!--
     --><a href="../guides/index.html"><div class="button"><div class="eye_outline"><img src="../media/eye.svg"></div><div>guides</div></div></a><!--
     --><a href="https://github.com/esowc/sci_vis"><div class="button last"><div class="eye_outline"><img src="../media/eye.svg"></div><div>contribute</div></div></a><!--
 --></div>
    <div class="page_section" id="cover">
        <div class="row">
            <div class="column small c1">
                <div class="v_hr hide_860"></div>
                <img src="../media/white-logo.svg">
            </div>
            <div class="slide column c2 hide_860">
                <div class="title_65">Troubleshooting</div>
            </div>
        </div>
        <div class="ver_s_15"></div>
        <div class="descr_box descr_box_outlined">
            <div class="title block_860">Troubleshooting</div>
            <div class="content">
                Good morrow my dear friend, I'm sorry to say that if you got here, then something went wrong
                during your VTK installation. In this page you'll find a few terminal commands that could be
                useful to fix your problem. Meanwhile, if you want you can open an issue on our
                <a href="http://bit.ly/bvtk_github" class="underline">GitHub page</a> so that we can try
                to solve your error once and for all and make the life easier for other users.
            </div>
        </div>
        <div class="ver_s_15"></div>
        <div class="descr_box">
            <div class="title">Getting started</div>
            <div class="content">
                Basic guides to install BVTK and take the first steps.
                <div class="ver_s_15"></div>
                <div class="dropdown_list">
                    <!--<div class="header dropdown_button">Install and run</div>-->
                    <a href="get-started/update.html"><div class="dropdown_button first">How to update BVTK</div></a>
                    <!--<div class="dropdown_button">How to run</div>-->
                </div>
            </div>
        </div>
        <div class="ver_s_15"></div>
        <div class="descr_box">
            <div class="title">Meteorological data</div>
            <div class="content">
                A few climate applications.
                <div class="ver_s_15"></div>
                <div class="dropdown_list">
                    <div class="header dropdown_button">NetCDF format</div>
                    <a href="net-cdf/open.html?fi=1"><div class="dropdown_button">How to open a netCDF file</div></a>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript" src="../../jquery-3.4.1.min.js"></script>
    <script type="text/javascript" src="../index.js"></script>
    <script type="text/javascript">
        collapse_width=680;
        $(window).trigger("resize");
    </script>
</div>
</body>
</html>