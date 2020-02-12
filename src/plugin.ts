/*!
   Copyright 2019 Ron Buckton

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
import ts from 'typescript';
import { Component, ConverterComponent } from "typedoc/dist/lib/converter/components";
import { Converter, Context } from "typedoc/dist/lib/converter";
import { Reflection, ReflectionKind } from "typedoc/dist/lib/models";

const classMember =
    ReflectionKind.Accessor |
    ReflectionKind.Constructor |
    ReflectionKind.Method |
    ReflectionKind.Property |
    ReflectionKind.Event;

@Component({ name: "fix-computed-names" })
export class FixComputedNamesPlugin extends ConverterComponent {

    initialize() {
        super.initialize();
        this.listenTo(this.owner, Converter.EVENT_CREATE_DECLARATION, this.onCreateDeclaration, 100);
    }

    private onCreateDeclaration(context: Context, reflection: Reflection, node: ts.Declaration) {
        const match = /^__@(\w+)$/.exec(reflection.name);
        if (match) {
            // rename built-in symbols
            reflection.name = `[Symbol.${match[1]}]`;
        } else if (reflection.kindOf(classMember) && reflection.name === "__computed") {
            // rename computed properties
            const name = ts.getNameOfDeclaration(node);
            const symbol = name && context.checker.getSymbolAtLocation(name); // get the late-bound symbol
            if (symbol) {
                reflection.name = context.checker.symbolToString(symbol, /*node*/ undefined, ts.SymbolFlags.ClassMember);
            } else if (name) {
                reflection.name = name.getText();
            }
        }
    }
}
