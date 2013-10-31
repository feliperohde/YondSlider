# Yondslider

A free jQuery plugin to create amazing and stylish slider and accordions

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/feliperohde/YondSlider/master/dist/YondSlider.min.js
[max]: https://raw.github.com/feliperohde/YondSlider/master/dist/YondSlider.js

In your web page:

```html
<script type="text/javascript" src="libs/jquery/jquery.js"></script>
<script type="text/javascript" src="libs/jquery-mousewheel/jquery.mousewheel.js"></script>
<script type="text/javascript" src="libs/jquery-easing/jquery.easing.1.3.min.js"></script>
<script type="text/javascript" src="src/YondSlider.js"></script>
<script>
    $(document).ready(function() {
        $('.beyond').YondSlider({
            max : 750,
            spacing : 5,
            defaultYond : 1,
            randtime : 2000,
            durationInner : 300
        });
    });
</script>
<div class="beyond" > 
    <div  class="theyond">// this is a external slide
        <div  class="slider">
            <div  class="door">
                <dl  class="view">
                    <dt>
                    //Your HTML here  // internal slide 1
                    </dt>
                    <dt>
                    //Your HTML here // interal slide 2
                    </dt>
                </dl>
            </div>
        </div>
    </div>
</div>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History

* **v1.0.0** - 2011-08-05
   - Initial release.
