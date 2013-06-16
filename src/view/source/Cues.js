/**
 * Cues kind
 *
 * @package     mod
 * @subpackage  elang
 * @copyright   2013 University of La Rochelle, France
 * @license     http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.html CeCILL-B license
 *
 * @since       0.0.1
 */
enyo.kind({
	/**
	 * Name of the kind
	 */
	name: 'Elang.Cues',

	/**
	 * Published properties:
	 * - elements: array of cues
	 * - limit: maximum number of cues per page
	 * Each property will have public setter and getter methods
	 */
	published: {elements: [], limit: 10},

	/**
	 * Handlers:
	 * - onPageChange: fired when the page changes
	 */
	handlers: {onPageChange: 'pageChange', onCueSelect: 'cueSelect'},

	/**
	 * Events:
	 * - onCueDeselect: fired when the cue is deselected
	 */
	events: {onCueDeselect: ''},

	/**
	 * Named components:
	 * - pagination: table pagination
	 * - body: table body
	 */
	components: [
		// List limit
		{
			classes: 'text-center',
			components: [
				{
					tag: 'label',
					content: $L('Limit per page')
				},
				{
					name: 'limit',
					kind: "Select",
					selected: 2,
					onchange: "limitSelect",
					components: [{content: 5, value: 5}, {content: 10, value: 10}, {content: 15, value: 15}, {content: 20, value: 20}, {content: 25, value: 25}]
				},
			]
		},

		// Pagination
		{
			kind: 'Elang.Pagination', name: 'pagination'
		},

		{
			tag: 'table',
			classes: 'table table-bordered table-condensed table-striped',
			components: [
				{
					tag: 'caption', content: $L('Cue Listing')},
				{
					tag: 'thead',
					components: [
						{
							tag: 'tr',
							components: [
								{tag: 'th', attributes: {width: '7%'}, content: $L('#')},
								{tag: 'th', content: $L('Title')}
							]
						}
					]
				},
				// Body
				{
					tag: 'tbody', name: 'body'
				},
			]
		},
	],

	/**
	 * Handle a page change event
	 *
	 * @protected
	 *
	 * @param   inSender  enyo.instance  Sender of the event
	 * @param   inEvent   Object		    Event fired
	 *
	 * @return void
	 *
	 * @since  0.0.1
	 */
	pageChange: function (inSender, inEvent)
	{
		this.fillCues(inEvent.number);
	},

	/**
	 * Handle a cue select event
	 *
	 * @protected
	 *
	 * @param   inSender  enyo.instance  Sender of the event
	 * @param   inEvent   Object		 Event fired
	 *
	 * @return void
	 *
	 * @since  0.0.1
	 */
	cueSelect: function (inSender, inEvent)
	{
		enyo.forEach(
			this.$.body.getClientControls(),
			function (row) {
				if (this != row)
				{
					row.removeClass('info');
				}
			},
			inEvent.originator
		);
	},

	/**
	 * Handle a limit select event
	 *
	 * @protected
	 *
	 * @param   inSender  enyo.instance  Sender of the event
	 * @param   inEvent   Object		 Event fired
	 *
	 * @return void
	 *
	 * @since  0.0.3
	 */
	limitSelect: function (inSender, inEvent)
	{
		this.setLimit(inSender.getValue());
		this.doCueDeselect();
		return true;
	},

	/**
	 * Detect a change in the limit value
	 *
	 * @protected
	 *
	 * @param  oldValue  integer  Old limit value
	 *
	 * @return  void
	 *
	 * @since  0.0.1
	 */
	limitChanged: function (oldValue)
	{
		if (this.limit > 0)
		{
			var index = [5, 10, 15, 20, 25].indexOf(Number(this.limit));
			if (index > 0)
			{
				this.$.limit.setSelected(index);
			}
			else
			{
				this.$.limit.setSelected(0);
			}
			this.fillCues(0);
		}
		else
		{
			var limit = this.limit;
			this.limit = oldValue;
			throw new RangeError('Limit value "' + limit + '" is incorrect');
		}
	},

	/**
	 * Detect a change in the elements value
	 *
	 * @protected
	 *
	 * @param  oldValue  array  Old elements value
	 *
	 * @return  void
	 *
	 * @since  0.0.1
	 */
	elementsChanged: function (oldValue)
	{
		this.fillCues(0);
	},

	/**
	 * Fill the table
	 *
	 * @protected
	 *
	 * @param  page	 integer  Page of the table
	 *
	 * @return  this
	 *
	 * @since  0.0.1
	 */
	fillCues: function (page)
	{
		this.$.pagination.setTotal(((this.elements.length / this.limit) | 0) + (this.elements.length % this.limit > 0 ? 1 : 0));
		var start = page * this.limit;
		var elements = this.elements.slice(start, start + this.limit);
		this.$.body.destroyClientControls();
		for (var i=0; i < elements.length; i++)
		{
			this.$.body.createComponent({kind: 'Elang.Cue', number: start + i + 1, data: elements[i]}, {owner: this});
		}
		return this.render();
	},
});

/**
 * Cue kind
 *
 * @package     mod
 * @subpackage  elang
 * @copyright   2013 University of La Rochelle, France
 * @license     http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.html CeCILL-B license
 *
 * @since       0.0.1
 */
enyo.kind({
	/**
	 * Name of the kind
	 */
	name: 'Elang.Cue',

	/**
	 * Published properties:
	 * - number: number of the cue
	 * - data: data hold by the cue
	 * Each property will have public setter and getter methods
	 */
	published: {number: 0, data: {}},

	/**
	 * Events:
	 * - onCueSelect: fired when the cue is changed
	 * - onCueDeselect: fired when the cue is deselected
	 */
	events: {onCueSelect: '', onCueDeselect: ''},

	/**
	 * tag for this kind
	 */
	tag: 'tr',

	/**
	 * Named components:
	 * - number: cue number
	 * - data: cue data
	 */
	components: [
		{name: 'number', tag: 'td'},
		{tag: 'td', components: [{name: 'title', tag: 'a', ontap: 'cueTap', attributes: {href:'#'}}]}
	],

	/**
	 * Create function
	 *
	 * @protected
	 *
	 * @since  0.0.1
	 */
	create: function ()
	{
		this.inherited(arguments);
		this.$.number.content = this.number;
		this.$.title.content = this.data.title;
	},

	/**
	 * Handle a tap event on a cue
	 *
	 * @protected
	 *
	 * @param   inSender  enyo.instance  Sender of the event
	 * @param   inEvent   Object		    Event fired
	 *
	 * @return  true
	 *
	 * @since  0.0.1
	 */
	cueTap: function (inSender, inEvent)
	{
		if (this.hasClass('info'))
		{
			this.removeClass('info');
			this.doCueDeselect();
		}
		else
		{
			this.addClass('info');
			this.doCueSelect();
		}

		// Prevents event propagation
		return true;
	},
});
