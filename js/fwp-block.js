const htmlToElem = ( html ) => wp.element.RawHTML( { children: html } );

function renderHtmlIconBlock(icons){

  let htmlBlock = '';

  const entries = Object.entries(icons);
  entries.forEach((item, i) => {

    let suffix;

    switch (item[1].free[0]) {
      case 'brands':
        suffix = 'b';
        break;
      case 'solid':
        suffix = 's';
        break;
      default:
        suffix = 'b';
    }

    htmlBlock += '<i title="' + item[1].label + '" class="fwp-icon fa' + suffix + ' fa-' + item[0] + '" data-class="fa' + suffix + ' fa-' + item[0] + '"></i>';

  });

  return htmlBlock;
}

function checkForLocalIcons(){

  if(localStorage.getItem('icons') != null){

    var retrievedIcons = JSON.parse(localStorage.getItem('icons'));
    return htmlToElem(renderHtmlIconBlock(retrievedIcons));

  } else {
    return '';
  }

}

wp.blocks.registerBlockType('fwp/icons', {
  title: 'FontAwesome Icons Picker',
  icon: 'image-filter',
  attributes: {
    content: {type: 'string'}
  },
  category: 'common',
  edit: function(props) {

    if(!props.attributes.content)
      props.attributes.content = '';

    function insertIconContent(dataClass, title){

      let iconHtml = '<i title = "' + title + '" class="' + dataClass + ' displayed-icon"></i>';

      props.setAttributes({content: props.attributes.content + iconHtml});

    }

    //reset click listeners
    $(document).off('click', '.fwp-icon');
    $(document).on('click', '.fwp-icon', function(){
      insertIconContent($(this).attr('data-class'), $(this).attr('title'));
    });

    $(document).off('click', '.displayed-icon');
    $(document).on('click', '.displayed-icon', function(){

      let element = $(this).get()[0].outerHTML;
      props.setAttributes({content: props.attributes.content.replace(element, '')});

      $(this).remove();

    });

    return React.createElement(
      'div',
      null,
      React.createElement(
        'h4',
        { style: { color: "#666" } },
        'Font Awesome Icon Picker'
      ),
      React.createElement(
        'div',
        {
          id: 'iconsDisplayContainer',
          className: 'selected-icons-display'
        },
        htmlToElem( props.attributes.content )
      ),
      React.createElement(
        "div",
        {
          id: 'iconsSelectorContainer',
          className: 'icons-container'
        },
        checkForLocalIcons()
      )
    );
  },
  save: function(props) {
    return (
      htmlToElem( props.attributes.content )
    );
  }
});

$(document).ready(function(){

  if(localStorage.getItem('icons') === null){
    $.getJSON(
      'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/metadata/icons.json',
      function(data) {

        const icons = JSON.parse(JSON.stringify(data));

        localStorage.setItem('icons', JSON.stringify(icons));

        if($('#iconsSelectorContainer'))
          $('#iconsSelectorContainer').append(renderHtmlIconBlock(icons));

      }
    );
  }

});
