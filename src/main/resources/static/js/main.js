jQuery(document).ready(function ($) {
    function ProductBuilder(element) {
        this.element = element;
        this.stepsWrapper = this.element.children('.cd-builder-steps');
        this.steps = this.element.find('.builder-step');
        //store some specific bulider steps
        this.models = this.element.find('[data-selection="models"]');
        this.summary;
        this.optionsLists = this.element.find('.options-list');
        //bottom summary
        this.fixedSummary = this.element.find('.cd-builder-footer');
        this.modelPreview = this.element.find('.selected-product').find('img');
        this.totPriceWrapper = this.element.find('.tot-price').find('b');
        //builder navigations
        this.mainNavigation = this.element.find('.cd-builder-main-nav');
        this.secondaryNavigation = this.element.find('.cd-builder-secondary-nav');
        //used to check if the builder content has been loaded properly
        this.loaded = true;

        // bind builder events
        this.bindEvents();
    }

    ProductBuilder.prototype.bindEvents = function () {
        var self = this;

        //detect click on the left navigation
        this.mainNavigation.on('click', 'li:not(.active)', function (event) {
            event.preventDefault();
            self.loaded && self.newContentSelected($(this).index());
        });

        //detect click on bottom fixed navigation
        this.secondaryNavigation.on('click', '.nav-item li:not(.buy)', function (event) {
            event.preventDefault();
            var stepNumber = ($(this).parents('.next').length > 0) ? $(this).index() + 1 : $(this).index() - 1;
            self.loaded && self.newContentSelected(stepNumber);
        });
        //detect click on one element in an options list (e.g, models, accessories)
        this.optionsLists.on('click', '.js-option', function (event) {
            self.updateListOptions($(this));
        });
        //detect clicks on customizer controls (e.g., colors ...)
        this.stepsWrapper.on('click', '.cd-product-customizer a', function (event) {
            event.preventDefault();
            self.customizeModel($(this));
        });
    };

    ProductBuilder.prototype.newContentSelected = function (nextStep) {
        //first - check if a model has been selected - user can navigate through the builder
        if (this.fixedSummary.hasClass('disabled')) {
            //no model has been selected - show alert
            this.fixedSummary.addClass('show-alert');
        }else {
            //model has been selected so show new content
            //first check if the color step has been completed - in this case update the product bottom preview
            if (this.steps.filter('.active').is('[data-selection="colors"]')) {
                //in this case, color has been changed - update the preview image
                var imageSelected = this.steps.filter('.active').find('.cd-product-previews').children('.selected').children('img').attr('src');
                this.modelPreview.attr('src', imageSelected);
            }
            //if Summary is the selected step (new step to be revealed) -> update summary content
            if (nextStep + 1 >= this.steps.length) {
                this.createSummary();
            }

            this.showNewContent(nextStep);
            this.updatePrimaryNav(nextStep);
            this.updateSecondaryNav(nextStep);
        }
    }

    ProductBuilder.prototype.showNewContent = function (nextStep) {
        var actualStep = this.steps.filter('.active').index() + 1;
        if (actualStep < nextStep + 1) {
            if (this.steps.eq(actualStep).data('selection') == 'doors') {
                if (!this.steps.eq(actualStep).find('.js-option').hasClass('selected')) {
                    this.fixedSummary.addClass('disabled');
                    this.mainNavigation.addClass('disabled');
                }
                var Size = this.steps.eq(actualStep-1).find('.cd-product-customizer').find('.selected').data('content');
                var num=Number(this.steps.eq(actualStep).find('.models-list').data('optionnum'));
                if (Size.indexOf('小') != -1) {
                    for (var i = 1; i <= num; i++) {
                        var id="door" + i;
                        if (i == 2 || i == 4) {
                            document.getElementById(id).style.display = "";
                        }
                        else document.getElementById(id).style.display = "none";
                    }
                } else {
                    for (var i = 1; i <= num; i++) {
                        if (i == 2 || i == 4) {
                            document.getElementById("door" + i).style.display = "none";
                        }
                        else document.getElementById("door" + i).style.display = "";
                    }
                }
            }

            //go to next section
            this.steps.eq(actualStep - 1).removeClass('active back').addClass('move-left');
            this.steps.eq(nextStep).addClass('active').removeClass('move-left back');
        } else {
            //go to previous section
            this.steps.eq(actualStep - 1).removeClass('active back move-left');
            this.steps.eq(nextStep).addClass('active back').removeClass('move-left');
        }
    }

    ProductBuilder.prototype.updatePrimaryNav = function (nextStep) {
        this.mainNavigation.find('li').eq(nextStep).addClass('active').siblings('.active').removeClass('active');
    }

    ProductBuilder.prototype.updateSecondaryNav = function (nextStep) {
        (nextStep == 0) ? this.fixedSummary.addClass('step-1') : this.fixedSummary.removeClass('step-1');

        this.secondaryNavigation.find('.nav-item.next').find('li').eq(nextStep).addClass('visible').removeClass('visited').prevAll().removeClass('visited').addClass('visited').end().nextAll().removeClass('visible visited');
        this.secondaryNavigation.find('.nav-item.prev').find('li').eq(nextStep).addClass('visible').removeClass('visited').prevAll().removeClass('visited').addClass('visited').end().nextAll().removeClass('visible visited');
    }

    ProductBuilder.prototype.createSummary = function () {
        var self = this;
        this.steps.each(function () {
            //this function may need to be updated according to your builder steps and summary
            var step = $(this);
            if ($(this).data('selection') == 'colors') {
                //create the Color summary
                var colorSelected = $(this).find('.cd-product-customizer').find('.selected'),
                    color = colorSelected.children('a').data('color'),
                    colorName = colorSelected.data('content'),
                    imageSelected = $(this).find('.cd-product-previews').find('.selected img').attr('src');

                //self.summary.find('.summary-color').find('.color-label').text(colorName).siblings('.color-swatch').attr('data-color', color);
                //self.summary.find('.box-size').attr('src', imageSelected);
                //self.summary.find('.product-preview').attr('src', imageSelected);
                self.summary.find('.summary-color').find('.color-label').text(colorName);
                if (imageSelected.indexOf("不锈钢") != -1) {
                    self.summary.find('.product-preview').attr('src', "img/箱式门房.jpg");
                } else {
                    self.summary.find('.product-preview').attr('src', "img/集装箱式门房.png");
                }
                self.summary.find('.summary-total-price').text('￥' + document.getElementById("total_price").innerText);
            }else if($(this).data('selection') == 'position'){
                var position=$(this).find('.cd-product-previews').find('.selected img').attr('src'),
                    positionName=$(this).find('.cd-product-customizer').find('.selected').data('content');
                self.summary.find('.summary-position').find('.position-label').text(positionName);
                self.summary.find('.box-position').attr('src', position);
            }else if($(this).data('selection') == 'doors'){
                var door=$(this).find('.models-list').find('.selected img').attr('src'),
                    doortype=$(this).find('.models-list').find('.selected').data('door');
                self.summary.find('.box-size').attr('src', door);
                self.summary.find('.summary-color').find('.door-label').text(doortype);
            }
            else if ($(this).data('selection') == 'accessories') {
                var selectedOptions = $(this).find('.js-option.selected'),
                    optionsContent = '';

                if (selectedOptions.length == 0) {
                    optionsContent = '<li><p>没有选择可选项</p></li>';
                } else {
                    selectedOptions.each(function () {
                        optionsContent += '<li><p>' + $(this).find('p').text() + '-￥' + $(this).data('price') + '</p></li>';
                    });
                }
                self.summary.find('.summary-accessories').children('li').remove().end().append($(optionsContent));
            }
        });

    }

    ProductBuilder.prototype.updateListOptions = function (listItem) {
        var self = this;
        var actualStep=this.steps.filter('.active').index() + 1;
        if (listItem.hasClass('js-radio')) { //单选的情况
            //this means only one option can be selected (e.g., models) - so check if there's another option selected and deselect it
            var alreadySelectedOption = listItem.siblings('.selected'),
                price = (alreadySelectedOption.length > 0) ? -Number(alreadySelectedOption.data('price')) : 0;

            //if the option was already selected and you are deselecting it - price is the price of the option just clicked
            (listItem.hasClass('selected'))
                ? price = -Number(listItem.data('price'))
                : price = Number(listItem.data('price')) + price;

            //now deselect all the other options
            alreadySelectedOption.removeClass('selected');
            //toggle the option just selected
            listItem.toggleClass('selected');
            //update totalPrice - only if the step is not the Models step
            (listItem.parents('[data-selection="models"]').length == 0) && self.updatePrice(price);

            if(listItem.parents('[data-selection="doors"]').length != 0){
                if (listItem.hasClass('selected')){
                    self.fixedSummary.add(self.mainNavigation).removeClass('disabled show-alert');
                } else {
                    self.fixedSummary.add(self.mainNavigation).addClass('disabled');
                }
            }
        } else {
            //more than one options can be selected - just need to add/remove the one just clicked
            var price = (listItem.hasClass('selected')) ? -Number(listItem.data('price')) : Number(listItem.data('price'));
            //toggle the option just selected
            listItem.toggleClass('selected');
            //update totalPrice
            self.updatePrice(price);
        }

        if (listItem.parents('[data-selection="models"]').length > 0) {
            //since a model has been selected/deselected, you need to update the builder content
            self.updateModelContent(listItem);
        }
    };

    ProductBuilder.prototype.updateModelContent = function (model) {
        var self = this;
        if (model.hasClass('selected')) {
            var modelType = model.data('model'),
                modelImage = model.find('img').attr('src');

            //need to update the product image in the bottom fixed navigation
            this.modelPreview.attr('src', modelImage);

            //need to update the content of the builder according to the selected product
            //first - remove the contet which refers to a different model
            this.models.siblings('li').remove();
            //second - load the new content
            $.ajax({
                type: "GET",
                dataType: "html",
                url: modelType + ".html",
                beforeSend: function () {
                    self.loaded = false;
                    model.siblings().removeClass('loaded');
                },
                success: function (data) {
                    self.models.after(data);
                    self.loaded = true;
                    model.addClass('loaded');
                    //activate top and bottom navigations
                    self.fixedSummary.add(self.mainNavigation).removeClass('disabled show-alert');
                    //update properties of the object
                    self.steps = self.element.find('.builder-step');
                    self.summary = self.element.find('[data-selection="summary"]');
                    //detect click on one element in an options list
                    self.optionsLists.off('click', '.js-option');
                    self.optionsLists = self.element.find('.options-list');
                    self.optionsLists.on('click', '.js-option', function (event) {
                        self.updateListOptions($(this));
                    });

                    //this is used not to load the animation the first time new content is loaded
                    self.element.find('.first-load').removeClass('first-load');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //you may want to show an error message here
                }
            });

            //update price (no adding/removing)
            this.totPriceWrapper.text(model.data('price'));
        } else {
            //no model has been selected
            this.fixedSummary.add(this.mainNavigation).addClass('disabled');
            //update price
            this.totPriceWrapper.text('0');

            this.models.find('.loaded').removeClass('loaded');
        }
    };

    ProductBuilder.prototype.customizeModel = function (target) {
        var parent = target.parent('li')
        index = parent.index();

        //update final price
        var price = (parent.hasClass('selected'))
            ? 0
            : Number(parent.data('price')) - parent.siblings('.selected').data('price');

        this.updatePrice(price);
        target.parent('li').addClass('selected').siblings().removeClass('selected').parents('.cd-product-customizer').siblings('.cd-product-previews').children('.selected').removeClass('selected').end().children('li').eq(index).addClass('selected');
    };

    ProductBuilder.prototype.updatePrice = function (price) {
        var actualPrice = Number(this.totPriceWrapper.text()) + price;
        this.totPriceWrapper.text(actualPrice);
    };

    if ($('.cd-product-builder').length > 0) {
        $('.cd-product-builder').each(function () {
            //create a productBuilder object for each .cd-product-builder
            new ProductBuilder($(this));
        });
    }
});
