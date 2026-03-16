export enum AttrTypeEnum {
	Number = "number",
	Select = "select",
	Link = "link",
	Button = "button",
	Text = "text",
	Textarea = "textarea",
	Image = "image",
	Tag = "tag",
	Price = "price",
	Rating = "rating",
	Date = "date",
	Color = "color",
	Switch = "switch",
}

export type AttrType = `${AttrTypeEnum}`;
