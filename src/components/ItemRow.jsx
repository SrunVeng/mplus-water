import React from "react";
import { currency } from "../utils/money";

export default function ItemRow({ item, product, onChangeProduct, onChangeQty, onRemove, disableRemove }) {
    return (
        <li className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-12 md:col-span-6">
                <Field label="Product">
                    <div className="flex items-center gap-3">
                        <img src={product?.img} alt={product?.name} className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-200" />
                        <select value={item.productId} onChange={e=>onChangeProduct(e.target.value)}
                                className="flex-1 h-11 rounded-xl border-slate-300 focus:border-slate-900 focus:ring-slate-900">
                            {/** The parent will pass in the catalog options to render via children if needed */}
                            {item.options}
                        </select>
                    </div>
                </Field>
            </div>

            <div className="col-span-6 md:col-span-2">
                <Field label="Qty">
                    <input type="number" min={1} value={item.quantity}
                           onChange={(e)=>onChangeQty(Math.max(1, Number(e.target.value || 1)))}
                           className="w-full h-11 rounded-xl border-slate-300 focus:border-slate-900 focus:ring-slate-900"/>
                </Field>
            </div>

            <div className="col-span-6 md:col-span-3">
                <Field label="Line total">
                    <div className="h-11 px-3 flex items-center rounded-xl border border-slate-200 bg-slate-50">
                        <span className="font-medium">{currency(item.lineTotal || 0)}</span>
                    </div>
                </Field>
            </div>

            <div className="col-span-12 md:col-span-1 flex md:justify-end pt-7">
                <button type="button" onClick={onRemove} className="text-sm text-rose-600 hover:text-rose-700 px-2 py-2"
                        disabled={disableRemove} title={disableRemove ? "At least one item required" : "Remove item"}>
                    Remove
                </button>
            </div>
        </li>
    );
}

function Field({ label, required, children }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-slate-900 tracking-wide">
                {label}{required ? <span className="text-rose-600"> *</span> : null}
            </label>
            {children}
        </div>
    );
}
