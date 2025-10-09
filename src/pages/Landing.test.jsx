import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Landing } from "./Landing";
import { MemoryRouter } from "react-router-dom";


describe('app', () => {
    test('should render component properly', () => {
        const { container } = render(
            <MemoryRouter>
                <Landing />
            </MemoryRouter>

        )

        expect(container).toMatchSnapshot();
    })
})