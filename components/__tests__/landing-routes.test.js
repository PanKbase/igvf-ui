import { render, screen } from "@testing-library/react";
import TestHomepage, {
  getServerSideProps as getLandingProps,
} from "../../pages/test-homepage/index";
import TestHomepageFeatured, {
  getServerSideProps as getFeaturedProps,
} from "../../pages/test-homepage/featured";
import { EMPTY_LANDING_DATA, getLandingData } from "../../lib/landing-server";

jest.mock("../../lib/landing-server", () => ({
  __esModule: true,
  EMPTY_LANDING_DATA: {
    stats: null,
    assayTiles: [],
    analysisTiles: [],
    donorChips: [],
    autoantibodyChip: null,
    resourceLink: null,
    recent: [],
    tryChips: [],
  },
  getLandingData: jest.fn(),
}));

function makeResponse() {
  return { setHeader: jest.fn() };
}

describe("/test-homepage routes", () => {
  it("marks both routes noindex in the X-Robots-Tag header", async () => {
    const landingRes = makeResponse();
    getLandingData.mockResolvedValue(EMPTY_LANDING_DATA);
    await getLandingProps({ res: landingRes });
    expect(landingRes.setHeader).toHaveBeenCalledWith(
      "X-Robots-Tag",
      "noindex, nofollow"
    );

    const featuredRes = makeResponse();
    await getFeaturedProps({ res: featuredRes });
    expect(featuredRes.setHeader).toHaveBeenCalledWith(
      "X-Robots-Tag",
      "noindex, nofollow"
    );
  });

  it("passes the live landing data to the page", async () => {
    const data = {
      ...EMPTY_LANDING_DATA,
      stats: { donors: 1, measurementSets: 2, analysisSets: 3 },
    };
    getLandingData.mockResolvedValue(data);

    const result = await getLandingProps({ res: makeResponse() });
    expect(result).toEqual({ props: { landing: data } });
  });

  it("falls back to the empty page data if getting the landing data throws", async () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => undefined);
    getLandingData.mockRejectedValue(new Error("boom"));

    const result = await getLandingProps({ res: makeResponse() });
    expect(result).toEqual({ props: { landing: EMPTY_LANDING_DATA } });
    log.mockRestore();
  });

  it("renders the landing page and the featured page", () => {
    const { unmount } = render(<TestHomepage landing={EMPTY_LANDING_DATA} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "PanKbase Data Library" })
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("featured-card")).toHaveLength(4);
    unmount();

    render(<TestHomepageFeatured />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Featured datasets" })
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("featured-card")).toHaveLength(8);
  });
});
