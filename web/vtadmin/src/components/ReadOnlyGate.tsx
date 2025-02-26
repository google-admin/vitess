/**
 * Copyright 2022 The Vitess Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { isReadOnlyMode } from '../util/env';

/**
 * ReadOnlyGate is used to hide child component trees when VTAdmin is running
 * in read only mode. For example:
 *
 *      <ReadOnlyGate>
 *          <SomeSpicyWriteAction />
 *      </ReadOnlyGate>
 */
export const ReadOnlyGate: React.FunctionComponent = ({ children }) => {
    if (isReadOnlyMode()) {
        // Returning `null` here prevents ReadOnlyGate from being used around
        // <Route> components within a switch statement; returning a fragment
        // doesn't seem to have this issue.
        return <></>;
    }

    return <>{children}</>;
};
