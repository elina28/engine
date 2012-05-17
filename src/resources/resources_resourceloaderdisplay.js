pc.extend(pc.resources, function () {
    
    /**
    * @name pc.resources.ResourceLoaderDisplay
    * @class Creates a DOMElement containing updated detailed information about what is loading/loaded. Useful for debugging loading errors.
    * This class is only really suitable for debug display at the moment.
    * @param {DOMElement} element The DOMElement to attach this display to
    */
    var ResourceLoaderDisplay = function (element, loader) {
        loader.bind('newbatch', this.handleNewBatch.bind(this));
        loader.bind('loading', this.handleLoading.bind(this));
        loader.bind('loaded', this.handleLoaded.bind(this));
        loader.bind('error', this.handleError.bind(this));
        loader.bind('batchprogress', this.handleBatchProgress.bind(this));
        //loader.bind('requestProgress', this.handleBatchProgress.bind(this));

        this._element = element;
        this._domCreate();
    };

    /**
    * @function
    * @private
    * @name pc.resources.ResourceLoaderDisplay#_domCreate
    * @description Create the DOM structure for the basic table
    */
    ResourceLoaderDisplay.prototype._domCreate = function () {
        this._rootTable = document.createElement('table');
        this._rootTable.setAttribute('class', 'pc-resourceloaderdisplay-root');
        this._element.appendChild(this._rootTable);
    };

    /**
    * @function
    * @private
    * @name pc.resources.ResourceLoaderDisplay#_domAddBatch
    * @description Create the DOM structure for a new ResourceBatch
    */
    ResourceLoaderDisplay.prototype._domAddBatch = function (batch) {
        var batchRow = document.createElement('tr');
        var titleElement = document.createElement('td');
        titleElement.textContent = batch.handle;
        var progressElement = document.createElement('td');
        progressElement.id = 'pc-resourceloaderdisplay-batchprogress-' + batch.handle;
        progressElement.textContent = '0%';

        batchRow.appendChild(titleElement);
        batchRow.appendChild(progressElement);

        var resourceRow = document.createElement('tr');
        var item = document.createElement('td');
        var subtable = document.createElement('table');
        subtable.id = 'pc-resourceloaderdisplay-subtable-' + batch.handle;
        item.appendChild(subtable);
        resourceRow.appendChild(item);
        
        this._rootTable.appendChild(batchRow);
        this._rootTable.appendChild(resourceRow);
    };

    /**
    * @function
    * @private
    * @name pc.resources.ResourceLoaderDisplay#_sanitizeId
    * @description Clean up the a text string for use as a dom element id
    */
    ResourceLoaderDisplay.prototype._sanitizeId = function (id) {
        return id.replace(/\//, '').replace(/\./, '');
    }

    /**
    * @function
    * @name pc.resources.ResourceLoaderDisplay#handleNewBatch
    * @description Handle a newbatch event from the ResourceLoader
    */
    ResourceLoaderDisplay.prototype.handleNewBatch = function (loader, batch) {
        this._domAddBatch(batch);
    };

    /**
    * @function
    * @name pc.resources.ResourceLoaderDisplay#handleLoading
    * @description Handle a loading event from ResourceLoader
    */
    ResourceLoaderDisplay.prototype.handleLoading = function (loader, request) {

        var i, len = request.batches.length;
        for (i = 0; i < len; i++) {
            var handle = request.batches[i].handle;
            
            var subtable = document.getElementById('pc-resourceloaderdisplay-subtable-' + handle);

            var row = document.createElement('tr');
            var idElement = document.createElement('td');
            idElement.textContent = request.identifier;
            row.appendChild(idElement);
            
            var progressElement = document.createElement('td');
            progressElement.id = 'pc-resourceloaderdisplay-progress-' + handle + '-' + this._sanitizeId(request.identifier);
            progressElement.textContent = "0%";
            row.appendChild(progressElement);

            subtable.appendChild(row);
        }
    };

    /**
    * @function
    * @name pc.resources.ResourceLoaderDisplay#handleLoaded
    * @description Handle a loaded event from ResourceLoader
    */
    ResourceLoaderDisplay.prototype.handleLoaded = function (loader, request, batch, resource) {
        var resourceProgress = document.getElementById('pc-resourceloaderdisplay-progress-' + batch.handle + '-' + this._sanitizeId(request.identifier));
        if (resourceProgress) {
            resourceProgress.textContent = "100%";    
        }
        
    };

    /**
    * @function
    * @name pc.resources.ResourceLoaderDisplay#handleError
    * @description Handle a error event from ResourceLoader
    */
    ResourceLoaderDisplay.prototype.handleError = function (loader, request, batch, errors) {
    };

    /**
    * @function
    * @name pc.resources.ResourceLoaderDisplay#handleBatchProgress
    * @description Handle a batchprogress event from ResourceLoader
    */
    ResourceLoaderDisplay.prototype.handleBatchProgress = function (loader, batch) {
        var batchProgress = document.getElementById('pc-resourceloaderdisplay-batchprogress-' + batch.handle);
        if (batchProgress) {
            batchProgress.textContent = batch.getProgress() + '%';    
        }
        
    };

    return {
        ResourceLoaderDisplay: ResourceLoaderDisplay
    }
}());