using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Application.ApiKeys;
using CmsProduct.Application.Behaviours;
using CmsProduct.Infrastructure.Database;
using CmsProduct.Infrastructure.Repositories;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CmsProduct.Api.Startup;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddCmsServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IApiKeyRepository, ApiKeyRepository>();
        services.AddScoped<IStatsRepository, StatsRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IAddressRepository, AddressRepository>();

        services.AddScoped<IApiKeyGenerator, ApiKeyGenerator>();

        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(ServiceCollectionExtensions).Assembly));

        services.AddValidatorsFromAssembly(typeof(ServiceCollectionExtensions).Assembly);

        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));

        return services;
    }
}
