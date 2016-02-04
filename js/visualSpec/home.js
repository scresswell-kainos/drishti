var drishtiSpec = {
    elm0 : {
        selector : 'css Selector Value',                // Mandatory css value
  
        /* Relative Position methods*/
        above : {Elm1 : 30 },                           // Elm0 is above Elm1 by 30px
        below : {Elm2 : 40 },                           // Elm0 is below Elm2 by 40px
        leftOf : {Elm3 : 50},                           // Elm0 is on left of Elm3 by 50px
        rightOf :{Elm4 : 20},                           // Elm0 is on right of Elm4 by 20px
         
        inside : { 
            Elm5: { 
                left:20, right:20,top:10, bottom:50    // Elm0 is inside Elm5 with left 20px, right 20px, and top 10px, bottom 50 px
                }
        },     
        heightAs : {Elm6 : '100%' },                    // Elm0 relative height to Elm6
        widthAs : {Elm6 : '90%' },                      // Elm0 relative width to Elm6
        visible : true,                                 // Elm0 is visible on page? (boolean true or false)
        absent : false,                                 // Elm0 is absent on the page? (boolean true or false)
        inViewport : true,                              // Elm0 is in screen-view? (boolean true or false)
         
        width : 200                                     // Elm0 width is 200 px
        height : 100                                    // Elm0 height is 100 px
        textIs : 'exact match',                         // Elm0 text exact match
        textContains : 'substring'                      // Elm0 substring text match
         
        /* Check Alignment with respect to other elements */
        aligned: {Elm7:'Top'},                          // Accepts 4 values 'Top', 'Bottom', 'Left', 'Right'
        attribute : 
            {href :'http://www.stuff.co.nz'},           // Elm0 attribute 'href' has value 'http://www.stuff.co.nz' (exact match)
        cssContains : 
            {'background-image' : 'header-title.png'}  // Elm0 css property 'background-image' has 'header-title.png' (exact match)
        /* Action Methods */
        showInViewport : true,                          // Shows Elm0 is screen view. (performs page-up/down depending on the element location)
        enterText : 'Random',                           // Enters the text 'Random' for Elm0
        click : true,                                   // clicks on Elm0
     
        /* child Methods */
        childItems : {'.main_article' : 5}              // css value of child and number of times the child appears in the page
        childList : 6,                                  // number of '<li>' within Elm0
        child : {}                                      // this can be repeat of all above methods (including childItems, childList & child itself)
         
        /* Page Scroll Actions */
        pageDown : 1,                                   // Performs number of page downs
        pageUp : 1,                                     // Performs number of page up
    }  
}