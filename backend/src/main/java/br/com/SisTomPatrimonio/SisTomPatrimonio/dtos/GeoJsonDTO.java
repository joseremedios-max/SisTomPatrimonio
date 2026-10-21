package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

public final class GeoJsonDTO {
    private GeoJsonDTO() {}

    @Data
    @AllArgsConstructor
    public static class FeatureCollection {
        private String type;
        private List<Feature> features;
    }

    @Data
    @AllArgsConstructor
    public static class Feature {
        private String type;
        private String id;
        private Geometry geometry;
        private Map<String, Object> properties;
    }

    @Data
    @AllArgsConstructor
    public static class Geometry {
        private String type;
        private List<Double> coordinates;
    }
}
